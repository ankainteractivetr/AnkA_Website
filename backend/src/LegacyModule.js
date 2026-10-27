import { SubmitContactMessageUseCase } from './application/use-cases/contact/SubmitContactMessageUseCase.js';
import { SubmitFeedbackUseCase } from './application/use-cases/games/SubmitFeedbackUseCase.js';
import { SubmitHighScoreUseCase } from './application/use-cases/games/SubmitHighScoreUseCase.js';
import { ListUseCase } from './application/use-cases/shared/ListUseCase.js';
import { ContactFormController } from './presentation/http/legacy/ContactFormController.js';
import { GameController } from './presentation/http/legacy/GameController.js';
import { ContactRoutes } from './presentation/http/routes/ContactRoutes.js';
import { GameRoutes } from './presentation/http/routes/GameRoutes.js';

/**
 * Endpoints whose requests and responses keep the shapes of the old site's services — the ulak.js contact form,
 * katip.py (game feedback) and umay.py (high scores) — so existing game clients keep working unchanged.
 */
export class LegacyModule
{
  #c;

  constructor(container)
  {
    this.#c = container;
  }

  routes()
  {
    const { contactMessages, mailer, config } = this.#c;
    const contact = new ContactFormController(new SubmitContactMessageUseCase(contactMessages, mailer, config.mail.to));
    return [new ContactRoutes('/contact', contact), new ContactRoutes('/ulak', contact), new GameRoutes(this.#gameController())];
  }

  #gameController()
  {
    const { gameFeedbacks, highScores } = this.#c;
    const useCases = { submitFeedback: new SubmitFeedbackUseCase(gameFeedbacks), submitHighScore: new SubmitHighScoreUseCase(highScores) };
    return new GameController({ ...useCases, leaderboard: new ListUseCase(highScores, 'findLeaderboard') });
  }
}
