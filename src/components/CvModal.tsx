import { useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { IRIS_PROFILE } from '../data/irisProfile';

interface CvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CvModal({ isOpen, onClose }: CvModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-modal-title"
      className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="bg-white border border-hairline rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-hairline bg-pastel-butter/60">
          <div className="min-w-0">
            <h2
              id="cv-modal-title"
              className="font-display text-lg font-semibold text-ink truncate"
            >
              Curriculum Vitae <span className="font-script italic font-medium text-2xl ml-1">Iris Takessian</span>
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={IRIS_PROFILE.cvPath}
              download="CV_Iris_Takessian_2026.pdf"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-display font-semibold uppercase tracking-[0.08em] text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer l'aperçu du CV"
              className="p-2 text-ink-muted hover:text-ink hover:bg-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-canvas p-2 md:p-4">
          <iframe
            src={IRIS_PROFILE.cvPath}
            title="CV d'Iris Takessian"
            className="w-full h-full rounded-xl border border-hairline bg-white"
          />
        </div>
      </div>
    </div>
  );
}
