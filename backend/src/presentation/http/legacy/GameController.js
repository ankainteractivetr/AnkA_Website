import { Language } from '../../../domain/value-objects/Language.js';
import { LocalizedText } from '../../../domain/value-objects/LocalizedText.js';
import { LegacyReply } from './LegacyReply.js';

const FEEDBACK_SAVED = new LocalizedText('We successfully received your feedback and recorded to our database. Thank You!', 'Geribildiriminizi aldık ve başarıyla veritabanımıza kaydettik!');
const FEEDBACK_FAILED = new LocalizedText("Couldn't record the feedback to our database! Please try again.", 'Geribildiriminizi veritabanımıza kaydedemedik! Lütfen tekrar deneyiniz.');
const SCORE_FAILED = new LocalizedText("Couldn't record the high score to our database! Please try again.", 'Skorunuzu veritabanımıza kaydedemedik! Lütfen tekrar deneyiniz.');

/** The games' endpoints, field for field as katip.py (feedback) and umay.py (high scores) answered them. */
export class GameController
{
  #submitFeedback;
  #submitHighScore;
  #leaderboard;

  constructor({ submitFeedback, submitHighScore, leaderboard })
  {
    this.#submitFeedback = submitFeedback;
    this.#submitHighScore = submitHighScore;
    this.#leaderboard = leaderboard;
  }

  feedback = async (req, res) =>
  {
    const language = Language.fromLegacyCode(req.body?.feedback_language);
    if (!language) return void res.json(LegacyReply.LANGUAGE_NOT_SET);
    const input = { gameId: req.body.feedback_game_id, message: req.body.feedback_message };
    const succeeded = () => ({ success: 1, message: language.pick(FEEDBACK_SAVED) });
    res.json(await LegacyReply.run(language, () => this.#submitFeedback.execute(input), { succeeded, failureText: FEEDBACK_FAILED }));
  };

  highScore = async (req, res) =>
  {
    const language = Language.fromLegacyCode(req.body?.score_language);
    if (!language) return void res.json(LegacyReply.LANGUAGE_NOT_SET);
    const input = { gameId: req.body.score_game_id, playerName: req.body.score_player_name, score: req.body.score_player_score };
    const succeeded = ({ score, position, total }) => ({ success: 1, response: 'OK', score: String(score), ranking: `${position} / ${total}` });
    res.json(await LegacyReply.run(language, () => this.#submitHighScore.execute(input), { succeeded, failureText: SCORE_FAILED }));
  };

  leaderboard = async (req, res) =>
  {
    const gameId = String(req.query.gameId ?? '');
    if (!gameId) return void res.status(400).json({ success: false, message: 'gameId required' });
    const { status, body } = await LegacyReply.leaderboard(() => this.#leaderboard.execute(gameId));
    res.status(status).json(body);
  };
}
