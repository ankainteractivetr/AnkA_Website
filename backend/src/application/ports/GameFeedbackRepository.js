import { NotImplementedError } from './NotImplementedError.js';

/** Port: feedback sent from inside the games. */
export class GameFeedbackRepository
{
  async add(_feedback)
  {
    throw new NotImplementedError(this, 'add');
  }

  /** The latest feedback, newest first. */
  async findRecent()
  {
    throw new NotImplementedError(this, 'findRecent');
  }

  async delete(_id)
  {
    throw new NotImplementedError(this, 'delete');
  }
}
