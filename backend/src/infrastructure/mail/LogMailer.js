import { Mailer } from '../../application/ports/Mailer.js';

/** Null object used when SMTP is not configured (development): logs the e-mail it would have sent. */
export class LogMailer extends Mailer
{
  async send({ to, subject, text })
  {
    console.info(`[mail not sent: SMTP_HOST / SMTP_USER are empty] To: ${to ?? '-'}\nSubject: ${subject}\n\n${text}\n`);
  }
}
