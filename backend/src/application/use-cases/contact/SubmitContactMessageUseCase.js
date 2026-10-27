import { ContactMessage } from '../../../domain/entities/ContactMessage.js';
import { ContactMessageEmail } from '../../notifications/ContactMessageEmail.js';

/**
 * Stores a contact form message and e-mails it to the studio. Both steps are best-effort and logged,
 * so the message reaches the studio as long as one of them works.
 */
export class SubmitContactMessageUseCase
{
  #messages;
  #mailer;
  #recipient;

  constructor(messages, mailer, recipient)
  {
    this.#messages = messages;
    this.#mailer = mailer;
    this.#recipient = recipient;
  }

  async execute({ input, language })
  {
    const message = ContactMessage.create(input, language);
    await SubmitContactMessageUseCase.#attempt('storing', () => this.#messages.add(message));
    await SubmitContactMessageUseCase.#attempt('e-mailing', () => this.#mailer.send(new ContactMessageEmail(message).to(this.#recipient)));
  }

  static async #attempt(step, work)
  {
    try {
      await work();
    } catch (error) {
      console.error(`[contact] ${step} the message failed: ${error.message}`);
    }
  }
}
