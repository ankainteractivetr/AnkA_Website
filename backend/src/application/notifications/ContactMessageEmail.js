/** The e-mail that forwards a contact message to the studio; replying to it answers the visitor. */
export class ContactMessageEmail
{
  #message;

  constructor(message)
  {
    this.#message = message;
  }

  to(recipient)
  {
    const { name, email, subject, message } = this.#message;
    return { to: recipient, replyTo: email, subject: `${name} sent us a message via our website`, text: `${name} (${email})\n\n${subject}\n\n${message}` };
  }
}
