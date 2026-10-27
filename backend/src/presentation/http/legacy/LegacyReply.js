import { LocalizedValidationError } from '../../../domain/errors.js';

/**
 * Builds the JSON bodies of the legacy endpoints (game clients, ulak.js), whose shapes predate this API and must not change:
 * { success: 1, … } or { success: 0, message } in the language the client asked for, always with HTTP 200.
 */
export class LegacyReply
{
  static LANGUAGE_NOT_SET = Object.freeze({ success: 0, message: 'Language is not set!' });

  /** Runs `work`; its result becomes `succeeded(result)`, a validation error its message, anything else `failureText`. */
  static async run(language, work, { succeeded, failureText })
  {
    try {
      return succeeded(await work());
    } catch (error) {
      return LegacyReply.#failure(error, language, failureText);
    }
  }

  /** { status, body } of the leaderboard: { success: true, data: rows }, or 500 { success: false } when it cannot be read. */
  static async leaderboard(readScores)
  {
    try {
      return { status: 200, body: { success: true, data: (await readScores()).map(LegacyReply.#leaderboardRow) } };
    } catch (error) {
      console.error(error);
      return { status: 500, body: { success: false } };
    }
  }

  /** One leaderboard row with the field names the game clients read. */
  static #leaderboardRow(highScore)
  {
    return { player_name: highScore.playerName, high_score: highScore.score, updated_at: highScore.updatedAt };
  }

  static #failure(error, language, failureText)
  {
    if (error instanceof LocalizedValidationError) return { success: 0, message: language.pick(error.text) };
    console.error(error);
    return { success: 0, message: language.pick(failureText) };
  }
}
