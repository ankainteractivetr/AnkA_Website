/** A text in both site languages; serialises as { en, tr }. */
export class LocalizedText
{
  static EMPTY = new LocalizedText('', '');

  constructor(en, tr)
  {
    this.en = en;
    this.tr = tr;
    Object.freeze(this);
  }
}
