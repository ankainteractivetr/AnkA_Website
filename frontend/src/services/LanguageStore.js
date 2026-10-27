/**
 * Remembers the visitor's site language ('tr' | 'en') in browser storage, so it survives reloads and new visits.
 * Storage can be unavailable (private mode, blocked site data): then the language is simply not remembered.
 */
export class LanguageStore
{
  #key;
  #languages;
  #getStorage;

  constructor(key, languages, getStorage = () => window.localStorage)
  {
    this.#key = key;
    this.#languages = languages;
    this.#getStorage = getStorage;
  }

  /** The saved language, or null when none is saved or the saved value is not a supported language. */
  read()
  {
    const saved = this.#withStorage((storage) => storage.getItem(this.#key));
    return this.#languages.includes(saved) ? saved : null;
  }

  save(lang)
  {
    this.#withStorage((storage) => storage.setItem(this.#key, lang));
  }

  #withStorage(action)
  {
    try {
      return action(this.#getStorage());
    } catch {
      return null;
    }
  }
}
