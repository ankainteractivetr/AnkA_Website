import { NotFoundError } from '../../../domain/errors.js';
import { Input } from '../../../domain/value-objects/Input.js';
import { UploadPath } from '../../../domain/value-objects/UploadPath.js';

/** Removes an image from its gallery and deletes its file and thumbnail. */
export class DeleteGalleryImageUseCase
{
  #gallery;
  #files;

  constructor(gallery, fileStorage)
  {
    this.#gallery = gallery;
    this.#files = fileStorage;
  }

  async execute({ ownerId, id })
  {
    const owner = Input.optionalId(ownerId, 'Project');
    const image = await this.#gallery.findById(owner, Input.id(id, 'Image'));
    if (!image) throw new NotFoundError('Image not found.');
    await this.#gallery.remove(owner, image.id);
    await this.#files.remove(UploadPath.removableFile(image.url));
  }
}
