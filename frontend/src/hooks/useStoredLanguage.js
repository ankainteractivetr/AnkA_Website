import { useCallback, useState } from 'react';

/**
 * The site language as [lang, setLang]: starts from the saved choice, or the browser's language when nothing is saved yet,
 * and saves every change. Only the visitor's own choice is saved, so the browser's language keeps applying until then.
 */
export function useStoredLanguage(languageStore, browserLanguage)
{
  const [lang, setLang] = useState(() => languageStore.read() ?? browserLanguage.detect());
  const changeLang = useCallback((next) => { languageStore.save(next); setLang(next); }, [languageStore]);
  return [lang, changeLang];
}
