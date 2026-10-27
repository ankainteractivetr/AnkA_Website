import { NotImplementedError } from './NotImplementedError.js';

/** Port: writes the "_thumb" copy of an image (see ThumbnailPath). */
export class ThumbnailGenerator
{
  /** Resolves to { created, reason }: created is false, with the reason, when the image is skipped. */
  async create(_sourcePath, _options)
  {
    throw new NotImplementedError(this, 'create');
  }
}
