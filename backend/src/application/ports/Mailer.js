import { NotImplementedError } from './NotImplementedError.js';

/** Port: sends a plain-text e-mail { to, subject, text, replyTo? } from the site's no-reply address. */
export class Mailer
{
  async send(_mail)
  {
    throw new NotImplementedError(this, 'send');
  }
}
