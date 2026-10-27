import { HighScoreRepository } from '../../application/ports/HighScoreRepository.js';
import { HighScore } from '../../domain/entities/HighScore.js';

const SELECT = 'SELECT id, game_id, player_name, high_score, created_at, updated_at FROM game_high_scores';
const RECENT_LIMIT = 500;
const LEADERBOARD_LIMIT = 100;
const RANK = `SELECT
  (SELECT COUNT(*) FROM game_high_scores WHERE game_id = ?) AS total,
  (SELECT COUNT(*) FROM game_high_scores WHERE game_id = ? AND high_score >= (
    SELECT high_score FROM game_high_scores WHERE player_name = ? AND game_id = ?)) AS position`;

export class MySqlHighScoreRepository extends HighScoreRepository
{
  #db;

  constructor(db)
  {
    super();
    this.#db = db;
  }

  async findScore(gameId, playerName)
  {
    const [row] = await this.#db.query('SELECT high_score FROM game_high_scores WHERE player_name = ? AND game_id = ?', [playerName, gameId]);
    return row ? Number(row.high_score) : null;
  }

  async add(highScore)
  {
    await this.#db.query('INSERT INTO game_high_scores (game_id, player_name, high_score) VALUES (?, ?, ?)', [highScore.gameId, highScore.playerName, highScore.score]);
  }

  async raise(highScore)
  {
    await this.#db.query('UPDATE game_high_scores SET high_score = ? WHERE game_id = ? AND player_name = ?', [highScore.score, highScore.gameId, highScore.playerName]);
  }

  async rankOf(gameId, playerName)
  {
    const [row] = await this.#db.query(RANK, [gameId, gameId, playerName, gameId]);
    return { position: Number(row.position), total: Number(row.total) };
  }

  findLeaderboard(gameId)
  {
    return this.#select('WHERE game_id = ? ORDER BY high_score DESC LIMIT ?', [gameId, LEADERBOARD_LIMIT]);
  }

  findRecent()
  {
    return this.#select('ORDER BY game_id ASC, high_score DESC LIMIT ?', [RECENT_LIMIT]);
  }

  async delete(id)
  {
    await this.#db.query('DELETE FROM game_high_scores WHERE id = ?', [id]);
  }

  async #select(clause, params)
  {
    const rows = await this.#db.query(`${SELECT} ${clause}`, params);
    return rows.map((row) => new HighScore({ id: row.id, gameId: row.game_id, playerName: row.player_name, score: Number(row.high_score), createdAt: row.created_at, updatedAt: row.updated_at }));
  }
}
