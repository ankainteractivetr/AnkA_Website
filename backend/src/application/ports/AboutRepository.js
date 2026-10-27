import { NotImplementedError } from './NotImplementedError.js';

/** Port: the about section's texts (one record; its gallery is a GalleryRepository). */
export class AboutRepository
{
  async find()
  {
    throw new NotImplementedError(this, 'find');
  }

  async save(_aboutContent)
  {
    throw new NotImplementedError(this, 'save');
  }
}
