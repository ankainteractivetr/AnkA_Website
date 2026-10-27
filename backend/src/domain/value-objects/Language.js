/**
 * A site language. The game clients and the old contact form send it as a legacy code ('0' English, '1' Turkish),
 * which is also how contact messages store it.
 */
export class Language
{
  static EN = new Language('en', '0');
  static TR = new Language('tr', '1');

  constructor(code, legacyCode)
  {
    this.code = code;
    this.legacyCode = legacyCode;
    Object.freeze(this);
  }

  /** The language of a legacy code, or null when the value is neither '0' nor '1'. */
  static fromLegacyCode(value)
  {
    return [Language.EN, Language.TR].find((language) => language.legacyCode === String(value ?? '')) ?? null;
  }

  /** This language's half of a LocalizedText. */
  pick(text)
  {
    return text[this.code];
  }

  toJSON()
  {
    return this.code;
  }
}
