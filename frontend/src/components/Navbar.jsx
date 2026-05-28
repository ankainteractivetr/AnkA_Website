import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';

const links = [
    { href: '#about',    en: 'About',    tr: 'Hakkımızda' },
    { href: '#games',    en: 'Games',    tr: 'Oyunlar' },
    { href: '#software', en: 'Software', tr: 'Yazılım' },
    { href: '#contact',  en: 'Contact',  tr: 'İletişim' },
];

export default function Navbar() {
    const { t } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav
            className={`sticky top-0 z-40 w-full transition-all duration-300 ${
                scrolled
                    ? 'bg-ink-900/85 backdrop-blur-xl border-b border-ink-400/70 shadow-[0_8px_30px_-15px_rgba(0,0,0,0.9)]'
                    : 'bg-ink-900/40 backdrop-blur-sm border-b border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
                {/* Logo / brand */}
                <a href="#top" className="flex items-center gap-3 group">
                    <img src="/AnkA-Interactive-Logo.png" alt="AnkA" className="w-10 h-10 transition-transform duration-300 group-hover:rotate-[8deg]" />
                    <div className="hidden sm:block leading-none">
                        <div className="font-display text-lg text-parchment tracking-wider">AnkA</div>
                        <div className="font-heading text-xs text-ember tracking-[0.3em]">INTERACTIVE</div>
                    </div>
                </a>

                {/* Desktop links */}
                <ul className="hidden md:flex items-center gap-7">
                    {links.map(l => (
                        <li key={l.href}>
                            <a
                                href={l.href}
                                className="font-heading text-base tracking-[0.2em] text-ash hover:text-parchment relative group transition-colors"
                            >
                                {t(l.en, l.tr).toUpperCase()}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-ember to-phoenix group-hover:w-full transition-all duration-300" />
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-3">
                    <LanguageToggle />
                    <button
                        className="md:hidden text-parchment p-2"
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle menu"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {open
                                ? <path d="M18 6 6 18M6 6l12 12" />
                                : <path d="M3 6h18M3 12h18M3 18h18" />}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <ul className="md:hidden border-t border-ink-400/70 bg-ink-900/95 backdrop-blur-xl">
                    {links.map(l => (
                        <li key={l.href} className="border-b border-ink-400/40 last:border-b-0">
                            <a
                                href={l.href}
                                onClick={() => setOpen(false)}
                                className="block px-6 py-4 font-heading text-base tracking-[0.2em] text-parchment hover:text-ember hover:bg-ink-700/50 transition-colors"
                            >
                                {t(l.en, l.tr).toUpperCase()}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
}
