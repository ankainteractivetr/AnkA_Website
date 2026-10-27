import { LocalizedValidationError } from '../errors.js';
import { LocalizedText } from '../value-objects/LocalizedText.js';

const MAX_NAME_LENGTH = 24;
const EMPTY_NAME = new LocalizedText('Player name is empty!', 'Oyuncu ismi boş!');
const LONG_NAME = new LocalizedText('Player name is too long. Should be 24 chars max!', 'Oyuncu ismi çok uzun. En fazla 24 karakter olmalı!');

/** A player's best score in one game (formerly umay.py); one row per game and player name. */
export class HighScore
{
  constructor({ id = null, gameId, playerName, score, createdAt = null, updatedAt = null })
  {
    Object.assign(this, { id, gameId, playerName, score, createdAt, updatedAt });
    Object.freeze(this);
  }

  static create(input = {})
  {
    const playerName = String(input.playerName ?? '').trim();
    if (!playerName) throw new LocalizedValidationError(EMPTY_NAME);
    if (playerName.length > MAX_NAME_LENGTH) throw new LocalizedValidationError(LONG_NAME);
    return new HighScore({ gameId: String(input.gameId ?? ''), playerName, score: Number.parseInt(input.score, 10) || 0 });
  }

  /** True when this score beats the stored one (`previous`, or null when the player has none yet). */
  beats(previous)
  {
    return previous === null || this.score > previous;
  }

  /** The player's high score after this one: a high score never goes down. */
  bestOf(previous)
  {
    return this.beats(previous) ? this.score : previous;
  }
}
