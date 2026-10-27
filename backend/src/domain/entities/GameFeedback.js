import { LocalizedValidationError } from '../errors.js';
import { LocalizedText } from '../value-objects/LocalizedText.js';

const MAX_LENGTH = 512;
const EMPTY = new LocalizedText('Message is empty', 'Mesaj boş!');
const TOO_LONG = new LocalizedText('Message is too long. Should be 512 chars max!', 'İleti çok uzun. En fazla 512 karakter olmalı!');

/** In-game feedback sent by a game client (formerly katip.py). */
export class GameFeedback
{
  constructor({ id = null, gameId, message, createdAt = null })
  {
    Object.assign(this, { id, gameId, message, createdAt });
    Object.freeze(this);
  }

  static create(input = {})
  {
    const message = String(input.message ?? '').trim();
    if (!message) throw new LocalizedValidationError(EMPTY);
    if (message.length >= MAX_LENGTH) throw new LocalizedValidationError(TOO_LONG);
    return new GameFeedback({ gameId: String(input.gameId ?? ''), message });
  }
}
