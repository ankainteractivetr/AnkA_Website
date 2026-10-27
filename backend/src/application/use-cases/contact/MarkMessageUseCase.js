import { NotFoundError } from '../../../domain/errors.js';
import { Input } from '../../../domain/value-objects/Input.js';

/** Marks a contact message read or unread; resolves to the updated message. */
export class MarkMessageUseCase
{
  #messages;

  constructor(messages)
  {
    this.#messages = messages;
  }

  async execute({ id, isRead })
  {
    const messageId = Input.id(id, 'Message');
    await this.#messages.setRead(messageId, Input.boolean(isRead));
    const message = await this.#messages.findById(messageId);
    if (!message) throw new NotFoundError('Message not found.');
    return message;
  }
}
