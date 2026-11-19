import { FileText, Mic, MicOff, PhoneOff } from 'lucide-react';
import { IRIS_PROFILE } from '../data/irisProfile';
import type { LiveConnectionState } from '../hooks/useLiveAssistant';

interface HeroSectionProps {
  voiceStatus: LiveConnectionState;
  isAssistantSpeaking: boolean;
  isMuted: boolean;
  audioLevel: number;
  onStartVoice: () => void;
  onStopVoice: () => void;
  onToggleMute: () => void;
  onOpenCv: () => void;
  onJumpToStudio: () => void;
}

export function HeroSection({
  voiceStatus,
  isAssistantSpeaking,
  isMuted,
  audioLevel,
  onStartVoice,
  onStopVoice,
  onToggleMute,
  onOpenCv,
  onJumpToStudio,
}: HeroSectionProps) {
  const isConnected = voiceStatus === 'connected';
  const isConnecting = voiceStatus === 'connecting';

  const outerScale = 1 + audioLevel * 0.22;
  const innerScale = 1 + audioLevel * 0.12;

  return (
    <section id="profil" className="pt-10 pb-14 md:pt-16 md:pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Editorial Typography & Primary Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between py-2">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted mb-5">
                {IRIS_PROFILE.city}
              </p>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-ink leading-[1.06] text-balance">
                <span className="uppercase tracking-[0.03em] block">
                  {IRIS_PROFILE.headlineTitle}
                </span>
                <span className="font-script italic font-semibold text-5xl sm:text-6xl lg:text-[4.25rem] text-accent block mt-1">
                  {IRIS_PROFILE.headlineScript}
                </span>
              </h1>

              <p className="mt-6 text-base md:text-[17px] text-ink-muted leading-relaxed max-w-2xl">
                {IRIS_PROFILE.bio}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-hairline flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={isConnected ? onJumpToStudio : onStartVoice}
                disabled={isConnecting}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-xs font-display font-semibold uppercase tracking-[0.08em] text-white bg-accent hover:bg-accent-hover disabled:opacity-60 rounded-xl transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <Mic className="w-4 h-4" />
                {isConnecting
                  ? 'Connexion vocale…'
                  : isConnected
                    ? 'Voir la conversation'
                    : "Démarrer l'entretien vocal"}
              </button>

              <button
                type="button"
                onClick={onOpenCv}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-xs font-display font-semibold uppercase tracking-[0.08em] text-ink bg-white hover:bg-pastel-butter border border-hairline rounded-xl transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <FileText className="w-4 h-4 text-accent" />
                Consulter le CV PDF
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Pastel Voice Presence Stage */}
          <div className="lg:col-span-5 flex">
            <div className="w-full rounded-2xl border border-hairline bg-gradient-to-br from-pastel-rose via-pastel-lavender to-pastel-butter p-7 md:p-8 flex flex-col justify-between min-h-[380px]">
              <div className="flex items-center justify-between gap-4">
                <span className="font-display text-xs uppercase tracking-[0.14em] font-semibold text-ink-muted">
                  Assistante vocale d&apos;Iris
                </span>
                <span className="text-xs font-medium text-ink-muted tabular-nums">
                  {isConnected
                    ? isAssistantSpeaking
                      ? 'En train de répondre'
                      : isMuted
                        ? 'Micro en sourdine'
                        : 'À l’écoute'
                    : isConnecting
                      ? 'Initialisation…'
                      : 'Prête pour l’échange'}
                </span>
              </div>

              {/* Reactive Organic Soundwave Aura */}
              <div className="my-6 flex flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={isConnected ? onStopVoice : onStartVoice}
                  disabled={isConnecting}
                  aria-label={
                    isConnected
                      ? "Terminer l'échange vocal"
                      : "Activer l'assistante vocale d'Iris"
                  }
                  className="relative w-44 h-44 flex items-center justify-center rounded-full cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
                >
                  <span
                    style={{
                      transform: `scale(${outerScale})`,
                    }}
                    className="absolute inset-0 rounded-full bg-white/55 border border-white/80 transition-transform duration-150 ease-out"
                  />
                  <span
                    style={{
                      transform: `scale(${innerScale})`,
                    }}
                    className="absolute inset-5 rounded-full bg-pastel-lavender/90 border border-accent/20 transition-transform duration-150 ease-out"
                  />
                  <span className="relative z-10 w-24 h-24 rounded-full bg-white border border-hairline shadow-xs flex flex-col items-center justify-center gap-1.5 group-hover:border-accent/40 transition-colors">
                    {isConnected ? (
                      <PhoneOff className="w-6 h-6 text-accent" />
                    ) : (
                      <Mic className="w-6 h-6 text-accent" />
                    )}
                    <span className="font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-ink">
                      {isConnected ? 'Terminer' : isConnecting ? 'Connexion' : 'Parler'}
                    </span>
                  </span>
                </button>

                <p className="mt-5 text-center font-script italic text-2xl text-ink leading-snug max-w-xs">
                  « Posez-moi vos questions sur le parcours et les projets d&apos;Iris. »
                </p>
              </div>

              <div className="pt-4 border-t border-ink/10 flex items-center justify-between gap-4">
                <span className="text-xs text-ink-muted">
                  Français &amp; English · Voix posée
                </span>
                {isConnected ? (
                  <button
                    type="button"
                    onClick={onToggleMute}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink bg-white/80 hover:bg-white border border-hairline rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {isMuted ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        Réactiver micro
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        Couper micro
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onJumpToStudio}
                    className="text-xs font-medium text-accent hover:text-accent-hover underline underline-offset-4 whitespace-nowrap cursor-pointer"
                  >
                    Ouvrir le studio complet
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Highlights Strip */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {IRIS_PROFILE.highlights.map((item, idx) => {
            const bgClasses = [
              'bg-pastel-rose/70',
              'bg-pastel-lavender/70',
              'bg-pastel-butter/80',
              'bg-pastel-sage/75',
            ];
            return (
              <div
                key={item.label}
                className={`rounded-2xl border border-hairline px-5 py-5 ${bgClasses[idx % bgClasses.length]}`}
              >
                <div className="font-display text-2xl md:text-3xl font-bold text-ink tabular-nums tracking-tight">
                  {item.value}
                </div>
                <p className="mt-1.5 text-xs md:text-sm text-ink-muted leading-snug">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
