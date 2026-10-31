import { useMemo } from 'react';
import { Translator } from '../domain/Translator';
import { useDocumentLanguage } from '../hooks/useDocumentLanguage';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useStoredLanguage } from '../hooks/useStoredLanguage';
import { LanguageContext } from './languageContext';
import { SITE_META } from './siteMeta';

/** Provides { lang, setLang, t, pick } to the whole app; the visitor's choice is remembered in browser storage and sets the page's language, title and description. */
export function LanguageProvider({ languageStore, browserLanguage, documentHead, children })
{
  const [lang, setLang] = useStoredLanguage(languageStore, browserLanguage);
  useDocumentLanguage(lang);
  useDocumentMeta(documentHead, SITE_META[lang]);
  const value = useMemo(() => ({ ...new Translator(lang), setLang }), [lang, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
