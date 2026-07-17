import { useEffect, useState } from 'react';
import client from '../api/client';
import { useLanguage } from '../context/LanguageContext';

const ICONS = {
    linkedin: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
        </svg>
    ),
    instagram: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    ),
    twitter: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    x: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    youtube: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23 12s0-3.6-.46-5.32a2.78 2.78 0 0 0-2-2C18.88 4.25 12 4.25 12 4.25s-6.88 0-8.54.43a2.78 2.78 0 0 0-2 2C1 8.4 1 12 1 12s0 3.6.46 5.32a2.78 2.78 0 0 0 2 2c1.66.43 8.54.43 8.54.43s6.88 0 8.54-.43a2.78 2.78 0 0 0 2-2C23 15.6 23 12 23 12zm-13.5 3.5v-7l6 3.5z" />
        </svg>
    ),
    facebook: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
        </svg>
    ),
    discord: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
    ),
    steam: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.616 0 .438 4.975.05 11.245l6.46 2.658c.547-.376 1.215-.595 1.93-.595.067 0 .131.005.197.007l2.882-4.158v-.06c0-2.495 2.04-4.527 4.547-4.527s4.546 2.032 4.546 4.527c0 2.494-2.04 4.527-4.546 4.527h-.105L11.997 16.7c0 .054.005.11.005.165 0 1.879-1.534 3.408-3.42 3.408-1.654 0-3.043-1.183-3.354-2.748L.494 15.667C1.92 20.491 6.547 24 12 24c6.628 0 12-5.371 12-12 0-6.626-5.372-12-12-12zm-4.526 18.214l-1.475-.607c.26.534.708.984 1.305 1.236 1.291.54 2.785-.075 3.325-1.371.262-.628.262-1.31.005-1.937-.255-.626-.74-1.111-1.367-1.371-.625-.26-1.296-.25-1.882-.027l1.524.629c.954.396 1.404 1.49 1.008 2.44-.396.95-1.49 1.404-2.443 1.008zm11.581-7.667c0-1.66-1.36-3.013-3.029-3.013-1.671 0-3.028 1.352-3.028 3.013 0 1.661 1.357 3.014 3.029 3.014 1.668 0 3.028-1.353 3.028-3.014zm-5.295-.005c0-1.255 1.014-2.27 2.272-2.27 1.254 0 2.273 1.015 2.273 2.27 0 1.254-1.019 2.27-2.273 2.27-1.258 0-2.272-1.016-2.272-2.27z" />
        </svg>
    ),
    twitch: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 0v18h6v4h4l4-4h6V0H4zm18 16h-6l-4 4v-4H6V2h16v14zm-6-10h-2v6h2V6zm-6 0H8v6h2V6z" />
        </svg>
    ),
    github: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
    ),
    bluesky: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364-3.911.58-7.386 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
        </svg>
    ),
};

function getIcon(name) {
    const key = (name || '').toLowerCase();
    if (ICONS[key]) return ICONS[key];
    // fallback "link" icon
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
    );
}

export default function Footer() {
    const { t } = useLanguage();
    const [info, setInfo] = useState(null);

    useEffect(() => {
        client.get('/public/contact-info').then(({ data }) => {
            if (data.success) setInfo(data.data);
        }).catch(() => {});
    }, []);

    return (
        <footer className="relative bg-ink-900/80 border-t border-ink-400/60 mt-0">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 grid sm:grid-cols-3 items-center gap-6">
                <div className="text-center sm:text-left">
                    <p className="font-deco text-2xl text-parchment leading-snug">AnkA Interactive</p>
                    <p className="font-heading text-ember tracking-widest text-sm">© 2023 — 2026</p>
                </div>

                <div className="flex justify-center gap-3">
                    {info?.social?.map(s => (
                        <a
                            key={s.id}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={s.platform}
                            title={s.platform}
                            className="w-11 h-11 flex items-center justify-center bg-ink-700/80 border border-ink-400 rounded-sm text-ash hover:text-phoenix hover:border-phoenix hover:shadow-phoenix transition-all duration-300"
                        >
                            {getIcon(s.icon_name)}
                        </a>
                    ))}
                </div>

                <div className="flex justify-center sm:justify-end">
                    <a
                        href="https://en.wikipedia.org/wiki/Turkey"
                        target="_blank"
                        rel="noopener noreferrer"
                        title={t('Made in Türkiye', 'Türkiye\'de Üretildi')}
                    >
                        <img
                            src="/MADE-IN-TURKIYE.png"
                            alt={t('Made in Türkiye', "Türkiye'de Üretildi")}
                            className="h-14 opacity-80 hover:opacity-100 transition-opacity"
                        />
                    </a>
                </div>
            </div>
        </footer>
    );
}
