/** Texts in the visitor's language: t('About', 'Hakkımızda') for UI strings, pick({ en, tr }) for texts from the API. */
export class Translator
{
  constructor(lang)
  {
    this.lang = lang;
    Object.freeze(this);
  }

  t = (en, tr) => (this.lang === 'tr' ? tr : en);

  pick = (text) => text?.[this.lang] ?? '';
}
