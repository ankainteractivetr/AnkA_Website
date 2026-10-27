import { NotImplementedError } from './NotImplementedError.js';

/**
 * Port: the ordered images of a gallery. `ownerId` is the project a screenshot belongs to,
 * or null for a gallery without an owner (the about section's).
 */
export class GalleryRepository
{
  async findAll(_ownerId)
  {
    throw new NotImplementedError(this, 'findAll');
  }

  /** The images of many owners at once: a Map of owner id → images. */
  async findByOwners(_ownerIds)
  {
    throw new NotImplementedError(this, 'findByOwners');
  }

  async findById(_ownerId, _id)
  {
    throw new NotImplementedError(this, 'findById');
  }

  /** Appends the image at the end of the gallery; resolves to it with its id and display order. */
  async add(_ownerId, _image)
  {
    throw new NotImplementedError(this, 'add');
  }

  async remove(_ownerId, _id)
  {
    throw new NotImplementedError(this, 'remove');
  }

  /** Gives each id its position in `ids` as display order. */
  async reorder(_ownerId, _ids)
  {
    throw new NotImplementedError(this, 'reorder');
  }
}
