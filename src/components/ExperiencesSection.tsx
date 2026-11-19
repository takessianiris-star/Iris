import { useEffect, useState } from 'react';
import { ArrowUpRight, Mic, X } from 'lucide-react';
import {
  EXPERIENCES,
  type ExperienceCategory,
  type ExperienceItem,
} from '../data/irisProfile';

interface ExperiencesSectionProps {
  onAskVoiceAboutExperience: (experience: ExperienceItem) => void;
}

const FILTER_TABS: { id: ExperienceCategory; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'alternance', label: 'Alternance & Prod' },
  { id: 'social', label: 'Social & Contenu' },
  { id: 'event', label: 'Événementiel & B2B' },
];

export function ExperiencesSection({
  onAskVoiceAboutExperience,
}: ExperiencesSectionProps) {
  const [filter, setFilter] = useState<ExperienceCategory>('all');
  const [selectedExp, setSelectedExp] = useState<ExperienceItem | null>(null);

  useEffect(() => {
    if (!selectedExp) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedExp(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedExp]);

  const filtered =
    filter === 'all'
      ? EXPERIENCES
      : EXPERIENCES.filter((exp) => exp.category === filter);

  return (
    <section id="experiences" className="py-16 md:py-22 border-b border-hairline">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted mb-2">
              Parcours professionnel
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink text-balance">
              <span className="uppercase tracking-[0.02em]">Expériences</span>{' '}
              <span className="font-script italic font-semibold text-4xl md:text-5xl text-accent">
                &amp; Réalisations
              </span>
            </h2>
          </div>

          <div
            role="group"
            aria-label="Filtrer les expériences par domaine"
            className="flex flex-wrap items-center gap-1 p-1 bg-pastel-butter border border-hairline rounded-xl self-start"
          >
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-2 text-xs font-display font-semibold uppercase tracking-[0.05em] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filter === tab.id
                    ? 'bg-white text-ink shadow-xs'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {filtered.map((exp) => {
            const spanClass =
              filter === 'all' && exp.featured ? 'lg:col-span-3' : 'lg:col-span-2';

            return (
              <article
                key={exp.id}
                className={`${spanClass} ${exp.pastelBg} rounded-2xl border border-hairline p-6 md:p-7 flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 text-xs text-ink-muted mb-4">
                    <span className="font-display uppercase tracking-[0.12em] font-semibold">
                      {exp.contractType} · {exp.period}
                    </span>
                    <span className="tabular-nums">{exp.categoryLabel}</span>
                  </div>

                  <h3 className="font-display text-xl md:text-2xl font-bold text-ink leading-snug">
                    {exp.role}
                  </h3>
                  <p className="font-script italic text-2xl font-semibold text-accent mt-0.5">
                    {exp.company}
                  </p>

                  <p className="mt-4 text-sm text-ink-muted leading-relaxed">
                    {exp.summary}
                  </p>

                  <ul className="mt-4 space-y-2 border-t border-ink/10 pt-4">
                    {exp.missions.slice(0, 3).map((mission) => (
                      <li
                        key={mission}
                        className="text-xs md:text-sm text-ink/90 leading-relaxed flex items-start gap-2.5"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0"
                        />
                        <span>{mission}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between gap-4">
                  <span className="text-xs text-ink-muted truncate">
                    {exp.skills.slice(0, 3).join(' · ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedExp(exp)}
                    className="inline-flex items-center gap-1 text-xs font-display font-semibold uppercase tracking-[0.08em] text-accent hover:text-accent-hover whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Détails
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Experience Case Detail Modal */}
      {selectedExp && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="exp-modal-title"
          className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4 md:p-6"
          onClick={() => setSelectedExp(null)}
        >
          <div
            className={`${selectedExp.pastelBg} bg-white border border-hairline rounded-2xl w-full max-w-2xl p-6 md:p-8 shadow-xl max-h-[88vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-hairline">
              <div>
                <p className="text-xs font-display uppercase tracking-[0.14em] font-semibold text-ink-muted">
                  {selectedExp.contractType} · {selectedExp.period} · {selectedExp.categoryLabel}
                </p>
                <h3
                  id="exp-modal-title"
                  className="mt-2 font-display text-2xl md:text-3xl font-bold text-ink"
                >
                  {selectedExp.role}
                </h3>
                <p className="font-script italic text-3xl font-semibold text-accent mt-0.5">
                  {selectedExp.company}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedExp(null)}
                aria-label="Fermer la fiche d'expérience"
                className="p-2 text-ink-muted hover:text-ink hover:bg-canvas rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-5">
              <p className="text-sm md:text-base text-ink-muted leading-relaxed">
                {selectedExp.summary}
              </p>

              <div>
                <h4 className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted mb-3">
                  Missions réalisées
                </h4>
                <ul className="space-y-2.5">
                  {selectedExp.missions.map((mission) => (
                    <li
                      key={mission}
                      className="text-sm text-ink leading-relaxed flex items-start gap-3"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0"
                      />
                      <span>{mission}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-hairline">
                <h4 className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted mb-2">
                  Compétences mobilisées
                </h4>
                <p className="text-sm text-ink font-medium">
                  {selectedExp.skills.join(' · ')}
                </p>
              </div>
            </div>

            <div className="pt-5 border-t border-hairline flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  const target = selectedExp;
                  setSelectedExp(null);
                  onAskVoiceAboutExperience(target);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-display font-semibold uppercase tracking-[0.08em] text-white bg-accent hover:bg-accent-hover rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                Poser une question vocale sur ce poste
              </button>
              <button
                type="button"
                onClick={() => setSelectedExp(null)}
                className="px-4 py-2.5 text-xs font-medium text-ink-muted hover:text-ink cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
