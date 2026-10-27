import { Input } from '../../../domain/value-objects/Input.js';

/** The images of one gallery, in display order. */
export class ListGalleryImagesUseCase
{
  #gallery;

  constructor(gallery)
  {
    this.#gallery = gallery;
  }

  execute({ ownerId })
  {
    return this.#gallery.findAll(Input.optionalId(ownerId, 'Project'));
  }
}
