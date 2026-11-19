import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenAssistant: () => void;
}

export function Navbar({ onOpenAssistant }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '#profil', label: 'Profil' },
    { href: '#experiences', label: 'Expériences' },
    { href: '#competences', label: 'Compétences' },
    { href: '#assistante', label: 'Assistante' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-md border-b border-hairline">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        <a
          href="#top"
          className="font-script italic text-2xl font-semibold tracking-tight text-ink whitespace-nowrap shrink-0"
        >
          Iris Takessian
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-ink-muted">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-ink transition-colors duration-150 whitespace-nowrap shrink-0 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm px-1 py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenAssistant}
            className="px-5 py-2.5 text-xs font-display font-semibold uppercase tracking-[0.08em] text-white bg-accent hover:bg-accent-hover rounded-xl transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Parler à l&apos;assistante
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={mobileOpen}
          className="md:hidden p-2.5 text-ink hover:bg-pastel-lavender rounded-lg transition-colors cursor-pointer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-hairline bg-canvas px-6 py-4 space-y-3">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-2 text-sm font-medium text-ink hover:text-accent transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onOpenAssistant();
            }}
            className="w-full px-5 py-3 text-xs font-display font-semibold uppercase tracking-[0.08em] text-white bg-accent hover:bg-accent-hover rounded-xl transition-colors whitespace-nowrap cursor-pointer"
          >
            Parler à l&apos;assistante
          </button>
        </div>
      )}
    </header>
  );
}
