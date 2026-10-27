import { Input } from '../../../domain/value-objects/Input.js';

/** Saves a gallery's order from the CMS's up/down buttons: `ids` first one first; resolves to the reordered gallery. */
export class ReorderGalleryImagesUseCase
{
  #gallery;

  constructor(gallery)
  {
    this.#gallery = gallery;
  }

  async execute({ ownerId, ids })
  {
    const owner = Input.optionalId(ownerId, 'Project');
    await this.#gallery.reorder(owner, Input.ids(ids, 'Order'));
    return this.#gallery.findAll(owner);
  }
}
