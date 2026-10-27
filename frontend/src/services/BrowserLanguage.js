/**
 * The site language for a visitor who has not chosen one yet, taken from the browser's preferred language:
 * a supported language is used as is ('tr-TR' → 'tr'), any other gives `fallback`.
 */
export class BrowserLanguage
{
  #languages;
  #fallback;
  #getNavigator;

  constructor(languages, fallback, getNavigator = () => window.navigator)
  {
    this.#languages = languages;
    this.#fallback = fallback;
    this.#getNavigator = getNavigator;
  }

  detect()
  {
    const code = this.#preferredTag().split('-')[0].toLowerCase();
    return this.#languages.includes(code) ? code : this.#fallback;
  }

  /** The browser's first language tag, e.g. 'tr-TR' (navigator.languages is ordered by preference). */
  #preferredTag()
  {
    const { languages, language } = this.#getNavigator();
    return languages?.[0] ?? language ?? '';
  }
}
