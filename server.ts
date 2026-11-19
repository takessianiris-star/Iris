import 'dotenv/config';
import http from 'node:http';
import path from 'node:path';
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import {
  GoogleGenAI,
  LiveServerMessage,
  Modality,
  ThinkingLevel,
} from '@google/genai';
import { IRIS_SYSTEM_INSTRUCTION } from './src/data/irisProfile.ts';

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

function createGeminiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    apiVersion: 'v1beta',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

interface ChatMessageInput {
  role: 'user' | 'assistant';
  text: string;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/chat', async (req, res) => {
    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error:
          "La clé API Gemini n'est pas configurée côté serveur. Vérifiez le panneau Settings > Secrets.",
      });
      return;
    }

    try {
      const body = req.body as { messages?: ChatMessageInput[]; prompt?: string };
      const history = Array.isArray(body.messages) ? body.messages : [];
      const fallbackPrompt =
        typeof body.prompt === 'string' ? body.prompt.trim() : '';

      const contents =
        history.length > 0
          ? history
              .filter((m) => typeof m.text === 'string' && m.text.trim().length > 0)
              .map((m) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.text.trim() }],
              }))
          : fallbackPrompt
            ? [{ role: 'user', parts: [{ text: fallbackPrompt }] }]
            : [];

      if (contents.length === 0) {
        res.status(400).json({ error: 'Veuillez saisir un message.' });
        return;
      }

      const ai = createGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction: IRIS_SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        res.status(502).json({
          error: "L'assistante n'a pas pu formuler de réponse pour le moment.",
        });
        return;
      }

      res.json({ reply });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erreur inattendue lors de la génération.';
      console.error('[POST /api/chat] Error:', message);
      res.status(500).json({ error: message });
    }
  });

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/live' });

  wss.on('connection', (clientWs: WebSocket) => {
    if (!process.env.GEMINI_API_KEY) {
      clientWs.send(
        JSON.stringify({
          type: 'error',
          message:
            "La clé API Gemini n'est pas configurée dans l'environnement serveur.",
        }),
      );
      clientWs.close();
      return;
    }

    const ai = createGeminiClient();
    let isClosed = false;

    const sendToClient = (payload: Record<string, unknown>) => {
      if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify(payload));
      }
    };

    const sessionPromise = ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: 'Kore',
            },
          },
        },
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        systemInstruction: IRIS_SYSTEM_INSTRUCTION,
      },
      callbacks: {
        onopen: () => {
          sendToClient({ type: 'ready' });
        },
        onmessage: (message: LiveServerMessage) => {
          const content = message.serverContent;
          if (!content) return;

          if (content.inputTranscription?.text) {
            sendToClient({
              type: 'inputTranscript',
              text: content.inputTranscription.text,
            });
          }

          if (content.outputTranscription?.text) {
            sendToClient({
              type: 'outputTranscript',
              text: content.outputTranscription.text,
            });
          }

          for (const part of content.modelTurn?.parts ?? []) {
            if (part.inlineData?.data) {
              sendToClient({
                type: 'audio',
                data: part.inlineData.data,
              });
            }
          }

          if (content.interrupted) {
            sendToClient({ type: 'interrupted' });
          }

          if (content.turnComplete) {
            sendToClient({ type: 'turnComplete' });
          }
        },
        onerror: (err) => {
          const message =
            err instanceof Error ? err.message : 'Erreur de connexion Live API.';
          console.error('[Live API] onerror:', message);
          sendToClient({ type: 'error', message });
        },
        onclose: () => {
          if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
            clientWs.close();
          }
        },
      },
    });

    sessionPromise.catch((err) => {
      const message =
        err instanceof Error
          ? err.message
          : 'Impossible de démarrer la session vocale Gemini Live.';
      console.error('[Live API] connect error:', message);
      sendToClient({ type: 'error', message });
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.close();
      }
    });

    clientWs.on('message', async (rawData) => {
      try {
        const parsed = JSON.parse(rawData.toString()) as {
          type?: string;
          audio?: string;
          text?: string;
        };
        const session = await sessionPromise;
        if (isClosed) return;

        if (parsed.type === 'audio' && typeof parsed.audio === 'string') {
          session.sendRealtimeInput({
            audio: {
              data: parsed.audio,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        } else if (parsed.type === 'text' && typeof parsed.text === 'string') {
          session.sendRealtimeInput({
            text: parsed.text,
          });
        }
      } catch (err) {
        console.error('[Live WS] message error:', err);
      }
    });

    clientWs.on('close', async () => {
      isClosed = true;
      try {
        const session = await sessionPromise;
        session.close();
      } catch {
        // Ignore cleanup errors if connect failed
      }
    });
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
