import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  MessageSquareText,
  Mic,
  MicOff,
  PhoneOff,
  RotateCcw,
  Send,
  Volume2,
} from 'lucide-react';
import { RECRUITER_PROMPTS } from '../data/irisProfile';
import type { LiveConnectionState, TranscriptEntry } from '../hooks/useLiveAssistant';

interface TextMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface VoiceAssistantStudioProps {
  voiceStatus: LiveConnectionState;
  isMuted: boolean;
  isAssistantSpeaking: boolean;
  voiceError: string | null;
  transcripts: TranscriptEntry[];
  audioLevel: number;
  onStartVoice: (initialPrompt?: string) => void;
  onStopVoice: () => void;
  onToggleMute: () => void;
  onSendTextToLive: (text: string) => void;
  onClearTranscripts: () => void;
}

export function VoiceAssistantStudio({
  voiceStatus,
  isMuted,
  isAssistantSpeaking,
  voiceError,
  transcripts,
  audioLevel,
  onStartVoice,
  onStopVoice,
  onToggleMute,
  onSendTextToLive,
  onClearTranscripts,
}: VoiceAssistantStudioProps) {
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [textMessages, setTextMessages] = useState<TextMessage[]>([
    {
      id: 'welcome-text',
      role: 'assistant',
      text: "Bonjour, je suis l'assistante d'Iris Takessian. Je connais en détail son parcours chez GRANDPRIX.tv, Jojo's Dough, Soyagency, Center Parcs et la Mairie d'Azay-Le-Rideau, ainsi que son Master Brand Experience & Event. Comment puis-je vous renseigner ?",
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSendingText, setIsSendingText] = useState(false);
  const [textError, setTextError] = useState<string | null>(null);

  const feedRef = useRef<HTMLDivElement | null>(null);
  const textFeedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [transcripts]);

  useEffect(() => {
    if (textFeedRef.current) {
      textFeedRef.current.scrollTop = textFeedRef.current.scrollHeight;
    }
  }, [textMessages, isSendingText]);

  const sendWrittenMessage = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || isSendingText) return;

    setTextError(null);
    const userMsg: TextMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = [...textMessages, userMsg];
    setTextMessages(nextHistory);
    setInputText('');
    setIsSendingText(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok || !data.reply) {
        throw new Error(data.error ?? "Impossible d'obtenir une réponse de l'assistante.");
      }

      setTextMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: data.reply!,
        },
      ]);
    } catch (err) {
      setTextError(
        err instanceof Error ? err.message : 'Erreur de communication avec le serveur.',
      );
    } finally {
      setIsSendingText(false);
    }
  };

  const handleStarterClick = (prompt: string) => {
    if (mode === 'voice') {
      onSendTextToLive(prompt);
    } else {
      void sendWrittenMessage(prompt);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (mode === 'voice') {
      onSendTextToLive(inputText);
      setInputText('');
    } else {
      void sendWrittenMessage(inputText);
    }
  };

  const isConnected = voiceStatus === 'connected';
  const isConnecting = voiceStatus === 'connecting';

  const waveBars = [0.45, 0.72, 1, 0.84, 0.58, 0.92, 0.65, 0.42];

  return (
    <section id="assistante" className="py-16 md:py-22 border-b border-hairline bg-white/70">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Heading + Segmented Mode Switch */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted mb-2">
              Studio d&apos;entretien interactif
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink text-balance">
              <span className="uppercase tracking-[0.02em]">Échanger avec</span>{' '}
              <span className="font-script italic font-semibold text-4xl md:text-5xl text-accent">
                l&apos;assistante d&apos;Iris
              </span>
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Mode d'interaction avec l'assistante"
            className="inline-flex items-center gap-1 p-1 bg-pastel-lavender border border-hairline rounded-xl self-start"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'voice'}
              onClick={() => setMode('voice')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-display font-semibold uppercase tracking-[0.06em] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'voice'
                  ? 'bg-white text-ink shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              Voix temps réel
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'text'}
              onClick={() => setMode('text')}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-display font-semibold uppercase tracking-[0.06em] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'text'
                  ? 'bg-white text-ink shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <MessageSquareText className="w-4 h-4" />
              Discussion écrite
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Controls & Quick Prompts */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-hairline bg-pastel-rose/55 p-6 md:p-7">
            <div>
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-ink/10">
                <div>
                  <h3 className="font-display text-base font-semibold text-ink">
                    Assistante d&apos;Iris · Entretien interactif
                  </h3>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Connaît l&apos;intégralité du CV, des outils et des expériences
                  </p>
                </div>
              </div>

              {mode === 'voice' && (
                <div className="my-6 rounded-xl bg-white/85 border border-hairline p-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-display text-xs uppercase tracking-[0.12em] font-semibold text-ink-muted">
                      {isConnected
                        ? isAssistantSpeaking
                          ? 'Réponse vocale en cours'
                          : isMuted
                            ? 'Micro coupé'
                            : 'Microphone actif'
                        : isConnecting
                          ? 'Connexion au studio…'
                          : 'Session vocale prête'}
                    </span>

                    <div className="flex items-end gap-1 h-6" aria-hidden="true">
                      {waveBars.map((multiplier, i) => {
                        const heightPct = isConnected
                          ? Math.max(20, Math.min(100, 20 + audioLevel * 95 * multiplier))
                          : 20;
                        return (
                          <span
                            key={i}
                            style={{ height: `${heightPct}%` }}
                            className="w-1 rounded-full bg-accent/70 transition-[height] duration-75"
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {!isConnected ? (
                      <button
                        type="button"
                        onClick={() => onStartVoice()}
                        disabled={isConnecting}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-display font-semibold uppercase tracking-[0.08em] text-white bg-accent hover:bg-accent-hover disabled:opacity-60 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <Mic className="w-4 h-4" />
                        {isConnecting ? 'Connexion…' : 'Activer le micro'}
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={onToggleMute}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-display font-semibold uppercase tracking-[0.06em] text-ink bg-pastel-butter hover:bg-white border border-hairline rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                        >
                          {isMuted ? (
                            <>
                              <MicOff className="w-4 h-4" />
                              Réactiver
                            </>
                          ) : (
                            <>
                              <Mic className="w-4 h-4" />
                              Sourdine
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={onStopVoice}
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-display font-semibold uppercase tracking-[0.06em] text-ink bg-white hover:bg-pastel-rose border border-hairline rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <PhoneOff className="w-4 h-4" />
                          Quitter
                        </button>
                      </>
                    )}
                  </div>

                  {voiceError && (
                    <p
                      role="alert"
                      className="mt-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5"
                    >
                      {voiceError}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-5">
                <p className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted mb-3">
                  Questions fréquentes des recruteurs
                </p>
                <div className="space-y-2">
                  {RECRUITER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleStarterClick(prompt)}
                      className="w-full text-left px-4 py-3 text-sm text-ink bg-white/80 hover:bg-white border border-hairline rounded-xl transition-colors cursor-pointer leading-snug"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-6 pt-4 border-t border-ink/10 text-xs text-ink-muted leading-relaxed">
              Vous pouvez poser vos questions en français ou en anglais. Les réponses s&apos;appuient
              exclusivement sur le CV et les missions réalisées par Iris.
            </p>
          </div>

          {/* Right Column: Live Transcript / Written Conversation Panel */}
          <div className="lg:col-span-7 flex flex-col rounded-2xl border border-hairline bg-canvas overflow-hidden min-h-[460px] max-h-[560px]">
            <div className="px-6 py-4 bg-white border-b border-hairline flex items-center justify-between gap-4">
              <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                {mode === 'voice' ? 'Transcription en direct' : 'Échange écrit'}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (mode === 'voice') {
                    onClearTranscripts();
                  } else {
                    setTextMessages([textMessages[0]]);
                    setTextError(null);
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors whitespace-nowrap cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Réinitialiser
              </button>
            </div>

            {mode === 'voice' ? (
              <div
                ref={feedRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white/70 to-pastel-lavender/30"
              >
                {transcripts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-6 py-10">
                    <p className="font-script italic text-3xl text-ink mb-2">
                      Prête à vous présenter Iris
                    </p>
                    <p className="text-sm text-ink-muted max-w-md leading-relaxed">
                      Cliquez sur « Activer le micro » pour parler naturellement, ou sélectionnez
                      l&apos;une des questions à gauche pour lancer l&apos;échange vocal.
                    </p>
                  </div>
                ) : (
                  transcripts.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex flex-col ${
                        entry.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <span className="text-[11px] font-display uppercase tracking-[0.1em] text-ink-muted mb-1 px-1">
                        {entry.role === 'user' ? 'Vous' : "Assistante d'Iris"}
                      </span>
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
                          entry.role === 'user'
                            ? 'bg-accent text-white border-accent'
                            : 'bg-white text-ink border-hairline'
                        }`}
                      >
                        {entry.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div
                ref={textFeedRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white/70 to-pastel-butter/35"
              >
                {textMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <span className="text-[11px] font-display uppercase tracking-[0.1em] text-ink-muted mb-1 px-1">
                      {msg.role === 'user' ? 'Vous' : "Assistante d'Iris"}
                    </span>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed border whitespace-pre-line ${
                        msg.role === 'user'
                          ? 'bg-accent text-white border-accent'
                          : 'bg-white text-ink border-hairline'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isSendingText && (
                  <div className="flex flex-col items-start">
                    <span className="text-[11px] font-display uppercase tracking-[0.1em] text-ink-muted mb-1 px-1">
                      Assistante d&apos;Iris
                    </span>
                    <div className="rounded-2xl px-4 py-3 text-sm text-ink-muted bg-white border border-hairline">
                      Rédaction en cours…
                    </div>
                  </div>
                )}

                {textError && (
                  <div
                    role="alert"
                    className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                  >
                    {textError}
                  </div>
                )}
              </div>
            )}

            <form
              onSubmit={handleFormSubmit}
              className="p-4 bg-white border-t border-hairline flex items-center gap-3"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  mode === 'voice'
                    ? 'Ou envoyez une question écrite dans la session vocale…'
                    : 'Posez votre question sur Iris (missions, outils, CDI)…'
                }
                className="flex-1 min-w-0 bg-canvas border border-hairline rounded-xl px-4 py-3 text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || (mode === 'text' && isSendingText)}
                aria-label="Envoyer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-display font-semibold uppercase tracking-[0.08em] text-white bg-accent hover:bg-accent-hover disabled:opacity-50 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Envoyer</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
