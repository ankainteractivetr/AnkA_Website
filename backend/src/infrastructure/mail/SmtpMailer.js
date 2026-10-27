import nodemailer from 'nodemailer';
import { Mailer } from '../../application/ports/Mailer.js';

const TIMEOUT_MS = 10_000;

/** Adapter over nodemailer: sends through the mail server in SMTP_* from SMTP_FROM (noreply@ankainteractive.com). */
export class SmtpMailer extends Mailer
{
  #transport;
  #from;

  constructor({ from, smtp })
  {
    super();
    this.#from = from;
    this.#transport = nodemailer.createTransport({ ...smtp, connectionTimeout: TIMEOUT_MS, greetingTimeout: TIMEOUT_MS, socketTimeout: TIMEOUT_MS });
  }

  async send({ to, subject, text, replyTo })
  {
    await this.#transport.sendMail({ from: this.#from, to, subject, text, replyTo });
  }
}
