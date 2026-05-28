import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext({ lang: 'en', setLang: () => {}, t: (en, tr) => en });

const LANG_KEY = 'anka_lang';

function readInitialLang() {
    if (typeof window === 'undefined') return 'en';
    try {
        const stored = localStorage.getItem(LANG_KEY);
        if (stored === 'en' || stored === 'tr') return stored;
    } catch {}
    // Browser hint
    const nav = navigator.language || '';
    if (nav.toLowerCase().startsWith('tr')) return 'tr';
    return 'en';
}

export function LanguageProvider({ children }) {
    const [lang, setLangState] = useState(readInitialLang);

    useEffect(() => {
        try { localStorage.setItem(LANG_KEY, lang); } catch {}
        document.documentElement.lang = lang;
    }, [lang]);

    const setLang = (next) => {
        if (next === 'en' || next === 'tr') setLangState(next);
    };

    const t = (en, tr) => (lang === 'tr' ? tr : en);

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
