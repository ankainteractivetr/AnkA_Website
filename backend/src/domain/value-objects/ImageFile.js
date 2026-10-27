import { ValidationError } from '../errors.js';

const MB = 1024 * 1024;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** An uploaded image, recognised by its content (magic bytes), never by the name or type the browser sent. */
export class ImageFile
{
  static #FORMATS = [
    { extension: 'jpg', matches: (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
    { extension: 'png', matches: (bytes) => bytes.subarray(0, 8).equals(PNG_SIGNATURE) },
    { extension: 'webp', matches: (bytes) => bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP' },
    { extension: 'gif', matches: (bytes) => /^GIF8[79]a$/.test(bytes.toString('ascii', 0, 6)) },
  ];

  constructor(bytes, extension)
  {
    this.bytes = bytes;
    this.extension = extension;
    Object.freeze(this);
  }

  static from(bytes, maxBytes)
  {
    if (!bytes?.length) throw new ValidationError('No file was selected.');
    if (bytes.length > maxBytes) throw new ValidationError(ImageFile.tooLargeMessage(maxBytes));
    const format = ImageFile.#FORMATS.find((candidate) => candidate.matches(bytes));
    if (!format) throw new ValidationError('Only JPG, PNG, WEBP and GIF images are allowed.');
    return new ImageFile(bytes, format.extension);
  }

  static tooLargeMessage(maxBytes)
  {
    return `Images may be at most ${Math.round(maxBytes / MB)} MB.`;
  }
}
