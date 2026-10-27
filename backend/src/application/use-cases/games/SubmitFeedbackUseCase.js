import { GameFeedback } from '../../../domain/entities/GameFeedback.js';

export class SubmitFeedbackUseCase
{
  #feedbacks;

  constructor(feedbacks)
  {
    this.#feedbacks = feedbacks;
  }

  async execute(input)
  {
    await this.#feedbacks.add(GameFeedback.create(input));
  }
}
