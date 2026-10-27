import { useEffect } from 'react';

/** Keeps <html lang> in sync with the active language. */
export function useDocumentLanguage(lang)
{
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
}
