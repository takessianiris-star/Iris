export function MarqueeRibbon() {
  const items = [
    'Stratégie de marque',
    'Événementiel',
    'Production média',
    'Création de contenu',
    'SEO & CRM',
    'Social Media',
    'Storytelling',
  ];

  const renderSequence = (keyPrefix: string) =>
    items.map((item, idx) => (
      <span key={`${keyPrefix}-${idx}`} className="inline-flex items-center gap-6 pr-6">
        <span className="font-display text-xs uppercase tracking-[0.18em] font-semibold text-ink-muted">
          {item}
        </span>
        <span aria-hidden="true" className="font-script italic text-lg text-accent">
          /
        </span>
      </span>
    ));

  return (
    <div
      aria-hidden="true"
      className="border-y border-hairline bg-pastel-lavender/65 py-3.5 overflow-hidden select-none"
    >
      <div className="animate-marquee">
        <div className="flex items-center">{renderSequence('a')}</div>
        <div className="flex items-center">{renderSequence('b')}</div>
      </div>
    </div>
  );
}
