import { useLanguage } from '../../i18n/useLanguage';

const LANGUAGES = Object.freeze([{ code: 'en', name: 'English' }, { code: 'tr', name: 'Türkçe' }]);
const FRAME = 'flex gap-1 backdrop-blur-md border border-ink-400 rounded-xs p-1';
const PLACEMENT = { floating: 'fixed bottom-5 right-5 z-50 bg-ink-800/90 shadow-glow-ember-sm', inline: 'bg-ink-800/60' };
const BUTTON = 'font-heading text-sm tracking-widest px-3 py-1 rounded-xs transition-all duration-200 text-ash hover:text-parchment '
  + 'aria-pressed:bg-linear-to-br aria-pressed:from-ember aria-pressed:to-ember-700 aria-pressed:text-white aria-pressed:shadow-glow-ember-sm';

/** EN / TR switch; `floating` pins it to the bottom-right corner of the page. */
export function LanguageToggle({ floating = false })
{
  const { lang, setLang } = useLanguage();
  return (
    <div className={`${FRAME} ${PLACEMENT[floating ? 'floating' : 'inline']}`} role="group" aria-label="Language / Dil">
      {LANGUAGES.map(({ code, name }) => <button key={code} type="button" className={BUTTON} aria-pressed={code === lang} aria-label={`Switch language to ${name}`} onClick={() => setLang(code)}>{code.toUpperCase()}</button>)}
    </div>
  );
}
