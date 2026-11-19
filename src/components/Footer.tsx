import { useState } from 'react';
import { Check, Copy, Download, Mail, Phone } from 'lucide-react';
import { IRIS_PROFILE } from '../data/irisProfile';

interface FooterProps {
  onOpenCv: () => void;
}

export function Footer({ onOpenCv }: FooterProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(IRIS_PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignored if clipboard unavailable
    }
  };

  return (
    <footer className="bg-pastel-butter/60 py-14 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-10 border-b border-hairline">
          <div className="md:col-span-6">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted mb-2">
              Recrutement CDI · {IRIS_PROFILE.city}
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink text-balance">
              <span className="uppercase tracking-[0.02em]">Échanger directement</span>{' '}
              <span className="font-script italic font-semibold text-3xl md:text-4xl text-accent">
                avec Iris Takessian
              </span>
            </h2>
            <p className="mt-3 text-sm text-ink-muted max-w-md leading-relaxed">
              Disponible pour un entretien en présentiel à Paris ou en visioconférence pour
              préparer son intégration en CDI à l&apos;issue de son alternance.
            </p>
          </div>

          <div className="md:col-span-6 flex flex-col sm:items-end gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${IRIS_PROFILE.email}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink bg-white hover:bg-pastel-lavender border border-hairline rounded-xl transition-colors"
              >
                <Mail className="w-4 h-4 text-accent" />
                {IRIS_PROFILE.email}
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label="Copier l'adresse email"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-ink-muted hover:text-ink bg-white border border-hairline rounded-xl transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-accent" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copier
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={IRIS_PROFILE.phoneHref}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink bg-white hover:bg-pastel-lavender border border-hairline rounded-xl transition-colors tabular-nums"
              >
                <Phone className="w-4 h-4 text-accent" />
                {IRIS_PROFILE.phone}
              </a>

              <button
                type="button"
                onClick={onOpenCv}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-display font-semibold uppercase tracking-[0.08em] text-white bg-accent hover:bg-accent-hover rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                <Download className="w-4 h-4" />
                CV PDF 2026
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <span className="font-script italic text-lg text-ink">
            Iris Takessian · Paris
          </span>
          <div className="flex items-center gap-6">
            <a href="#profil" className="hover:text-ink transition-colors">
              Profil
            </a>
            <a href="#experiences" className="hover:text-ink transition-colors">
              Expériences
            </a>
            <a href="#competences" className="hover:text-ink transition-colors">
              Compétences
            </a>
            <a href="#assistante" className="hover:text-ink transition-colors">
              Assistante
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
