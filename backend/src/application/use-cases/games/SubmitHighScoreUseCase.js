import { HighScore } from '../../../domain/entities/HighScore.js';

/** Records a score (kept only when it beats the player's best); resolves to { score, position, total }. */
export class SubmitHighScoreUseCase
{
  #highScores;

  constructor(highScores)
  {
    this.#highScores = highScores;
  }

  async execute(input)
  {
    const highScore = HighScore.create(input);
    const previous = await this.#highScores.findScore(highScore.gameId, highScore.playerName);
    if (previous === null) await this.#highScores.add(highScore);
    else if (highScore.beats(previous)) await this.#highScores.raise(highScore);
    const rank = await this.#highScores.rankOf(highScore.gameId, highScore.playerName);
    return { score: highScore.bestOf(previous), ...rank };
  }
}
