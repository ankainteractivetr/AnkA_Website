import { GameFeedbackRepository } from '../../application/ports/GameFeedbackRepository.js';
import { GameFeedback } from '../../domain/entities/GameFeedback.js';

const RECENT_LIMIT = 500;

export class MySqlGameFeedbackRepository extends GameFeedbackRepository
{
  #db;

  constructor(db)
  {
    super();
    this.#db = db;
  }

  async add(feedback)
  {
    await this.#db.query('INSERT INTO game_feedbacks (game_id, message) VALUES (?, ?)', [feedback.gameId, feedback.message]);
  }

  async findRecent()
  {
    const rows = await this.#db.query('SELECT id, game_id, message, created_at FROM game_feedbacks ORDER BY created_at DESC, id DESC LIMIT ?', [RECENT_LIMIT]);
    return rows.map((row) => new GameFeedback({ id: row.id, gameId: row.game_id, message: row.message, createdAt: row.created_at }));
  }

  async delete(id)
  {
    await this.#db.query('DELETE FROM game_feedbacks WHERE id = ?', [id]);
  }
}
