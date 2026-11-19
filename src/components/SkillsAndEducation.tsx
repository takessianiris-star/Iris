import { useState } from 'react';
import { EXPERIENCES, FORMATIONS, IRIS_PROFILE, SKILLS } from '../data/irisProfile';

export function SkillsAndEducation() {
  const [selectedSkillName, setSelectedSkillName] = useState<string>(SKILLS[0].name);
  const [skillFilter, setSkillFilter] = useState<'all' | 'hard' | 'soft'>('all');

  const visibleSkills =
    skillFilter === 'all'
      ? SKILLS
      : SKILLS.filter((skill) => skill.type === skillFilter);

  const activeSkill =
    SKILLS.find((s) => s.name === selectedSkillName) ?? visibleSkills[0] ?? SKILLS[0];

  const relatedExperiences = EXPERIENCES.filter((exp) =>
    activeSkill.relatedExperienceIds.includes(exp.id),
  );

  return (
    <section id="competences" className="py-16 md:py-22 border-b border-hairline bg-white/60">
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        {/* Interactive Skills Explorer */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted mb-2">
                Savoir-faire &amp; outils
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink text-balance">
                <span className="uppercase tracking-[0.02em]">Compétences</span>{' '}
                <span className="font-script italic font-semibold text-4xl md:text-5xl text-accent">
                  en action
                </span>
              </h2>
            </div>

            <div
              role="group"
              aria-label="Filtrer par type de compétence"
              className="inline-flex items-center gap-1 p-1 bg-pastel-sage border border-hairline rounded-xl self-start"
            >
              {[
                { id: 'all' as const, label: 'Toutes' },
                { id: 'soft' as const, label: 'Soft Skills' },
                { id: 'hard' as const, label: 'Hard Skills' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSkillFilter(tab.id);
                    const firstMatch =
                      tab.id === 'all'
                        ? SKILLS[0]
                        : SKILLS.find((s) => s.type === tab.id);
                    if (firstMatch) setSelectedSkillName(firstMatch.name);
                  }}
                  className={`px-3.5 py-2 text-xs font-display font-semibold uppercase tracking-[0.05em] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    skillFilter === tab.id
                      ? 'bg-white text-ink shadow-xs'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 flex flex-wrap gap-2.5">
              {visibleSkills.map((skill) => {
                const isSelected = skill.name === activeSkill.name;
                return (
                  <button
                    key={skill.name}
                    type="button"
                    onClick={() => setSelectedSkillName(skill.name)}
                    className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-colors whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-accent text-white border-accent'
                        : 'bg-white text-ink border-hairline hover:bg-pastel-lavender'
                    }`}
                  >
                    {skill.name}
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-hairline bg-pastel-lavender/65 p-6 md:p-7">
              <p className="font-display text-xs uppercase tracking-[0.14em] font-semibold text-ink-muted">
                {activeSkill.type === 'hard' ? 'Hard Skill · Outil & méthode' : 'Soft Skill · Savoir-être & stratégie'}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-ink">
                {activeSkill.name}
              </h3>
              <p className="mt-2.5 text-sm text-ink-muted leading-relaxed">
                {activeSkill.description}
              </p>

              <div className="mt-5 pt-4 border-t border-ink/10">
                <p className="font-display text-xs uppercase tracking-[0.12em] font-semibold text-ink-muted mb-2.5">
                  Appliqué chez
                </p>
                <div className="space-y-2">
                  {relatedExperiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex items-baseline justify-between gap-3 text-sm"
                    >
                      <span className="font-semibold text-ink">{exp.company}</span>
                      <span className="text-xs text-ink-muted truncate">{exp.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formations & Hobbies Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-hairline">
          <div className="lg:col-span-7">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted mb-2">
              Parcours académique
            </p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-ink mb-6">
              <span className="uppercase tracking-[0.02em]">Formations</span>{' '}
              <span className="font-script italic font-semibold text-3xl md:text-4xl text-accent">
                Sup de Pub
              </span>
            </h3>

            <div className="space-y-4">
              {FORMATIONS.map((edu, index) => {
                const pastelTints = [
                  'bg-pastel-butter/75',
                  'bg-pastel-rose/65',
                  'bg-pastel-sage/65',
                ];
                return (
                  <div
                    key={edu.id}
                    className={`rounded-2xl border border-hairline p-5 md:p-6 ${pastelTints[index % pastelTints.length]}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted mb-2">
                      <span className="font-display uppercase tracking-[0.12em] font-semibold">
                        {edu.school} · {edu.status}
                      </span>
                      <span className="tabular-nums font-medium">{edu.period}</span>
                    </div>
                    <h4 className="font-display text-lg font-bold text-ink">
                      {edu.degree}
                    </h4>
                    <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">
                      {edu.focus}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted mb-2">
              Équilibre &amp; inspirations
            </p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-ink mb-6">
              <span className="uppercase tracking-[0.02em]">Centres</span>{' '}
              <span className="font-script italic font-semibold text-3xl md:text-4xl text-accent">
                d&apos;intérêt
              </span>
            </h3>

            <div className="rounded-2xl border border-hairline bg-white p-6 md:p-7 space-y-5">
              {IRIS_PROFILE.hobbies.map((hobby, idx) => (
                <div
                  key={hobby.name}
                  className={idx > 0 ? 'pt-5 border-t border-hairline' : ''}
                >
                  <h4 className="font-display text-base font-bold text-ink">
                    {hobby.name}
                  </h4>
                  <p className="mt-1 text-sm text-ink-muted leading-relaxed">
                    {hobby.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
