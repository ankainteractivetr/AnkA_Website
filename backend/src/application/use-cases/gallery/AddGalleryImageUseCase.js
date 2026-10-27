import { GalleryImage } from '../../../domain/entities/GalleryImage.js';
import { ImageFile } from '../../../domain/value-objects/ImageFile.js';
import { Input } from '../../../domain/value-objects/Input.js';
import { UploadPath } from '../../../domain/value-objects/UploadPath.js';

/** Stores an uploaded image (with its thumbnail) and appends it to a gallery; the file is removed again if that fails. */
export class AddGalleryImageUseCase
{
  #gallery;
  #files;
  #maxBytes;

  constructor(gallery, fileStorage, maxBytes)
  {
    this.#gallery = gallery;
    this.#files = fileStorage;
    this.#maxBytes = maxBytes;
  }

  async execute({ ownerId, bytes, alt })
  {
    const imageFile = ImageFile.from(bytes, this.#maxBytes);
    const owner = Input.optionalId(ownerId, 'Project');
    const image = GalleryImage.create({ alt });
    return this.#addOrDiscard(owner, image, await this.#files.save(imageFile));
  }

  async #addOrDiscard(owner, image, relativePath)
  {
    try {
      return await this.#gallery.add(owner, image.withUrl(UploadPath.url(relativePath)));
    } catch (error) {
      await this.#files.remove(relativePath);
      throw error;
    }
  }
}
