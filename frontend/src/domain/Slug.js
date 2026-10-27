const TURKISH_LETTERS = Object.freeze({ ı: 'i', ş: 's', ğ: 'g', ü: 'u', ö: 'o', ç: 'c' });

/** A URL- and anchor-safe name made from a title: "Ayzıt 2" → "ayzit-2". */
export class Slug
{
  static from(text)
  {
    return String(text ?? '').toLocaleLowerCase('tr').replace(/[ışğüöç]/g, (letter) => TURKISH_LETTERS[letter])
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
}
