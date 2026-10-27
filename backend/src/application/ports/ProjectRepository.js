import { NotImplementedError } from './NotImplementedError.js';

/** Port: games and software (their screenshots are a GalleryRepository). */
export class ProjectRepository
{
  async findAll(_options)
  {
    throw new NotImplementedError(this, 'findAll');
  }

  async findById(_id)
  {
    throw new NotImplementedError(this, 'findById');
  }

  /** Resolves to the project with its id; rejects with a ConflictError when the slug is taken. */
  async create(_project)
  {
    throw new NotImplementedError(this, 'create');
  }

  async update(_project)
  {
    throw new NotImplementedError(this, 'update');
  }

  async delete(_id)
  {
    throw new NotImplementedError(this, 'delete');
  }
}
