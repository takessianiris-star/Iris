import { useCallback, useEffect, useRef, useState } from 'react';

export type LiveConnectionState = 'idle' | 'connecting' | 'connected' | 'error';

export interface TranscriptEntry {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

function float32ToPcm16Base64(float32: Float32Array): string {
  const int16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const clamped = Math.max(-1, Math.min(1, float32[i]));
    int16[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
  }
  const bytes = new Uint8Array(int16.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...slice);
  }
  return btoa(binary);
}

function base64Pcm16ToFloat32(base64: string): Float32Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const dataView = new DataView(bytes.buffer);
  const sampleCount = Math.floor(len / 2);
  const float32 = new Float32Array(sampleCount);
  for (let i = 0; i < sampleCount; i++) {
    const int16 = dataView.getInt16(i * 2, true);
    float32[i] = int16 / 32768;
  }
  return float32;
}

export function useLiveAssistant() {
  const [status, setStatus] = useState<LiveConnectionState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const inputAnalyserRef = useRef<AnalyserNode | null>(null);
  const outputAnalyserRef = useRef<AnalyserNode | null>(null);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isMutedRef = useRef(false);
  const isReadyRef = useRef(false);
  const pendingPromptRef = useRef<string | null>(null);

  const appendTranscript = useCallback(
    (role: 'user' | 'assistant', chunk: string) => {
      if (!chunk) return;
      setTranscripts((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.role === role) {
          const needsSpace =
            last.text.length > 0 &&
            !/[\s'’(-]$/.test(last.text) &&
            !/^[\s.,!?;:)'’]/.test(chunk);
          return [
            ...prev.slice(0, -1),
            {
              ...last,
              text: `${last.text}${needsSpace ? ' ' : ''}${chunk}`,
            },
          ];
        }
        return [
          ...prev,
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            role,
            text: chunk.trimStart(),
          },
        ];
      });
    },
    [],
  );

  const stopPlaybackQueue = useCallback(() => {
    for (const source of activeSourcesRef.current) {
      try {
        source.stop();
      } catch {
        // Already stopped
      }
    }
    activeSourcesRef.current.clear();
    if (outputCtxRef.current) {
      nextStartTimeRef.current = outputCtxRef.current.currentTime;
    } else {
      nextStartTimeRef.current = 0;
    }
    setIsAssistantSpeaking(false);
  }, []);

  const cleanup = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    stopPlaybackQueue();

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
      processorRef.current = null;
    }

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }

    if (inputCtxRef.current) {
      inputCtxRef.current.close().catch(() => {});
      inputCtxRef.current = null;
    }

    if (outputCtxRef.current) {
      outputCtxRef.current.close().catch(() => {});
      outputCtxRef.current = null;
    }

    inputAnalyserRef.current = null;
    outputAnalyserRef.current = null;
    isReadyRef.current = false;

    if (wsRef.current) {
      const ws = wsRef.current;
      wsRef.current = null;
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    }

    setAudioLevel(0);
    setIsAssistantSpeaking(false);
  }, [stopPlaybackQueue]);

  const disconnect = useCallback(() => {
    pendingPromptRef.current = null;
    cleanup();
    setStatus('idle');
  }, [cleanup]);

  const startLevelMeter = useCallback(() => {
    const inputFreq = new Uint8Array(64);
    const outputFreq = new Uint8Array(64);

    const tick = () => {
      let peak = 0;
      if (outputAnalyserRef.current && activeSourcesRef.current.size > 0) {
        outputAnalyserRef.current.getByteFrequencyData(outputFreq);
        let sum = 0;
        for (let i = 0; i < outputFreq.length; i++) sum += outputFreq[i];
        peak = Math.max(peak, sum / (outputFreq.length * 255));
      }
      if (inputAnalyserRef.current && !isMutedRef.current) {
        inputAnalyserRef.current.getByteFrequencyData(inputFreq);
        let sum = 0;
        for (let i = 0; i < inputFreq.length; i++) sum += inputFreq[i];
        peak = Math.max(peak, (sum / (inputFreq.length * 255)) * 1.15);
      }
      setAudioLevel(Math.min(1, peak * 1.8));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const connect = useCallback(
    async (initialPrompt?: string) => {
      if (status === 'connecting' || status === 'connected') {
        if (initialPrompt && wsRef.current?.readyState === WebSocket.OPEN && isReadyRef.current) {
          appendTranscript('user', initialPrompt);
          wsRef.current.send(JSON.stringify({ type: 'text', text: initialPrompt }));
        }
        return;
      }

      setError(null);
      setStatus('connecting');
      isMutedRef.current = false;
      setIsMuted(false);
      pendingPromptRef.current = initialPrompt ?? null;

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error(
            "Votre navigateur ne permet pas la capture microphone pour l'audio en direct.",
          );
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        streamRef.current = stream;

        const inputCtx = new AudioContext({ sampleRate: 16000 });
        const outputCtx = new AudioContext({ sampleRate: 24000 });
        await inputCtx.resume();
        await outputCtx.resume();

        inputCtxRef.current = inputCtx;
        outputCtxRef.current = outputCtx;
        nextStartTimeRef.current = outputCtx.currentTime;

        const inputAnalyser = inputCtx.createAnalyser();
        inputAnalyser.fftSize = 128;
        inputAnalyserRef.current = inputAnalyser;

        const outputAnalyser = outputCtx.createAnalyser();
        outputAnalyser.fftSize = 128;
        outputAnalyser.connect(outputCtx.destination);
        outputAnalyserRef.current = outputAnalyser;

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(`${protocol}//${window.location.host}/live`);
        wsRef.current = ws;

        ws.onopen = () => {
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          const silentGain = inputCtx.createGain();
          silentGain.gain.value = 0;

          source.connect(inputAnalyser);
          inputAnalyser.connect(processor);
          processor.connect(silentGain);
          silentGain.connect(inputCtx.destination);

          processor.onaudioprocess = (event) => {
            if (isMutedRef.current || !isReadyRef.current) return;
            if (ws.readyState !== WebSocket.OPEN) return;
            const channelData = event.inputBuffer.getChannelData(0);
            const base64 = float32ToPcm16Base64(channelData);
            ws.send(JSON.stringify({ type: 'audio', audio: base64 }));
          };

          processorRef.current = processor;
          startLevelMeter();
        };

        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data as string) as {
            type?: string;
            data?: string;
            text?: string;
            message?: string;
          };

          if (msg.type === 'ready') {
            isReadyRef.current = true;
            setStatus('connected');
            if (pendingPromptRef.current) {
              const prompt = pendingPromptRef.current;
              pendingPromptRef.current = null;
              appendTranscript('user', prompt);
              ws.send(JSON.stringify({ type: 'text', text: prompt }));
            }
          } else if (msg.type === 'audio' && msg.data && outputCtxRef.current) {
            const ctx = outputCtxRef.current;
            const float32 = base64Pcm16ToFloat32(msg.data);
            const buffer = ctx.createBuffer(1, float32.length, 24000);
            buffer.getChannelData(0).set(float32);

            const now = ctx.currentTime;
            if (nextStartTimeRef.current < now) {
              nextStartTimeRef.current = now + 0.02;
            }

            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(outputAnalyserRef.current ?? ctx.destination);

            activeSourcesRef.current.add(source);
            setIsAssistantSpeaking(true);

            source.onended = () => {
              activeSourcesRef.current.delete(source);
              if (activeSourcesRef.current.size === 0) {
                setIsAssistantSpeaking(false);
              }
            };

            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
          } else if (msg.type === 'inputTranscript' && msg.text) {
            appendTranscript('user', msg.text);
          } else if (msg.type === 'outputTranscript' && msg.text) {
            appendTranscript('assistant', msg.text);
          } else if (msg.type === 'interrupted') {
            stopPlaybackQueue();
          } else if (msg.type === 'error') {
            setError(msg.message ?? 'Une erreur est survenue lors de la session vocale.');
            cleanup();
            setStatus('error');
          }
        };

        ws.onerror = () => {
          setError('Impossible de joindre le serveur vocal temps réel.');
          cleanup();
          setStatus('error');
        };

        ws.onclose = () => {
          if (wsRef.current === ws) {
            cleanup();
            setStatus((prev) => (prev === 'error' ? 'error' : 'idle'));
          }
        };
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "L'accès au microphone ou à la session vocale a échoué.";
        setError(message);
        cleanup();
        setStatus('error');
      }
    },
    [appendTranscript, cleanup, startLevelMeter, status, stopPlaybackQueue],
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
      return next;
    });
  }, []);

  const sendTextToLive = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      if (wsRef.current?.readyState === WebSocket.OPEN && isReadyRef.current) {
        appendTranscript('user', trimmed);
        wsRef.current.send(JSON.stringify({ type: 'text', text: trimmed }));
      } else {
        void connect(trimmed);
      }
    },
    [appendTranscript, connect],
  );

  const clearTranscripts = useCallback(() => {
    setTranscripts([]);
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    status,
    isMuted,
    isAssistantSpeaking,
    error,
    transcripts,
    audioLevel,
    connect,
    disconnect,
    toggleMute,
    sendTextToLive,
    clearTranscripts,
  };
}
