import { NotImplementedError } from './NotImplementedError.js';

/** Port: the games' high score tables. */
export class HighScoreRepository
{
  /** The player's stored score in that game, or null when there is none. */
  async findScore(_gameId, _playerName)
  {
    throw new NotImplementedError(this, 'findScore');
  }

  async add(_highScore)
  {
    throw new NotImplementedError(this, 'add');
  }

  /** Stores the high score's score as the player's new best. */
  async raise(_highScore)
  {
    throw new NotImplementedError(this, 'raise');
  }

  /** { position, total }: the player's 1-based place among that game's players (higher score first). */
  async rankOf(_gameId, _playerName)
  {
    throw new NotImplementedError(this, 'rankOf');
  }

  /** The best scores of one game, best first. */
  async findLeaderboard(_gameId)
  {
    throw new NotImplementedError(this, 'findLeaderboard');
  }

  /** All games' scores for the CMS, grouped by game, best first. */
  async findRecent()
  {
    throw new NotImplementedError(this, 'findRecent');
  }

  async delete(_id)
  {
    throw new NotImplementedError(this, 'delete');
  }
}
