import { useMemo } from 'react';
import { Translator } from '../domain/Translator';
import { useDocumentLanguage } from '../hooks/useDocumentLanguage';
import { useStoredLanguage } from '../hooks/useStoredLanguage';
import { LanguageContext } from './languageContext';

/** Provides { lang, setLang, t, pick } to the whole app; the visitor's choice is remembered in browser storage. */
export function LanguageProvider({ languageStore, browserLanguage, children })
{
  const [lang, setLang] = useStoredLanguage(languageStore, browserLanguage);
  useDocumentLanguage(lang);
  const value = useMemo(() => ({ ...new Translator(lang), setLang }), [lang, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
