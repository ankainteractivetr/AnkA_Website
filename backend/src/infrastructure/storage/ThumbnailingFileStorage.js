import { FileStorage } from '../../application/ports/FileStorage.js';
import { ThumbnailPath } from '../../domain/value-objects/ThumbnailPath.js';

/**
 * Decorator for a FileStorage: every saved image gets its "_thumb" copy beside it, and removing an image removes that copy too.
 * A thumbnail that cannot be made never fails the upload: it is logged, and the site falls back to the full-size image.
 */
export class ThumbnailingFileStorage extends FileStorage
{
  #storage;
  #thumbnails;

  constructor(storage, thumbnailGenerator)
  {
    super();
    this.#storage = storage;
    this.#thumbnails = thumbnailGenerator;
  }

  async save(imageFile)
  {
    const relativePath = await this.#storage.save(imageFile);
    await this.#createThumbnail(relativePath);
    return relativePath;
  }

  async remove(relativePath)
  {
    if (!relativePath) return;
    await this.#storage.remove(relativePath);
    await this.#storage.remove(ThumbnailPath.of(relativePath));
  }

  pathOf(relativePath)
  {
    return this.#storage.pathOf(relativePath);
  }

  async #createThumbnail(relativePath)
  {
    try {
      await this.#thumbnails.create(this.#storage.pathOf(relativePath));
    } catch (error) {
      console.warn(`[thumb] could not create a thumbnail for ${relativePath}: ${error.message}`);
    }
  }
}
