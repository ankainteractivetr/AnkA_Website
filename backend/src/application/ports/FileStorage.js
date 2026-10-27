import { NotImplementedError } from './NotImplementedError.js';

/** Port: stores uploaded images and returns their path relative to the uploads folder. */
export class FileStorage
{
  async save(_imageFile)
  {
    throw new NotImplementedError(this, 'save');
  }

  /** Deletes the file; a missing file or an empty path is ignored. */
  async remove(_relativePath)
  {
    throw new NotImplementedError(this, 'remove');
  }

  /** The absolute path of a stored file. */
  pathOf(_relativePath)
  {
    throw new NotImplementedError(this, 'pathOf');
  }
}
