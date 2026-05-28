import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle({ floating = false }) {
    const { lang, setLang } = useLanguage();

    if (floating) {
        return (
            <div className="fixed bottom-5 right-5 z-50 flex gap-1 bg-ink-800/90 backdrop-blur-md border border-ink-400 rounded-sm shadow-ember-sm p-1">
                <LangButton lang="en" current={lang} setLang={setLang} />
                <LangButton lang="tr" current={lang} setLang={setLang} />
            </div>
        );
    }

    return (
        <div className="flex gap-1 bg-ink-800/60 backdrop-blur-md border border-ink-400 rounded-sm p-1">
            <LangButton lang="en" current={lang} setLang={setLang} />
            <LangButton lang="tr" current={lang} setLang={setLang} />
        </div>
    );
}

function LangButton({ lang, current, setLang }) {
    const active = lang === current;
    return (
        <button
            onClick={() => setLang(lang)}
            className={`font-heading text-sm tracking-widest px-3 py-1 rounded-sm transition-all duration-200
                ${active
                    ? 'bg-gradient-to-br from-ember to-ember-700 text-white shadow-ember-sm'
                    : 'text-ash hover:text-parchment'}`}
            aria-label={`Switch language to ${lang === 'en' ? 'English' : 'Türkçe'}`}
        >
            {lang.toUpperCase()}
        </button>
    );
}
