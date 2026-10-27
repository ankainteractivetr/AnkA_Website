const LOCALES = Object.freeze({ en: 'en-GB', tr: 'tr-TR' });

/** Dates from the API (ISO strings) as the CMS shows them, in the interface language. */
export class DateText
{
  static dateTime(value, lang)
  {
    return value ? new Date(value).toLocaleString(LOCALES[lang]) : '';
  }

  static date(value, lang)
  {
    return value ? new Date(value).toLocaleDateString(LOCALES[lang]) : '';
  }
}
