import { LocalizedValidationError } from '../errors.js';
import { LocalizedText } from '../value-objects/LocalizedText.js';

const EMAIL = /^\S+@\S+\.\S+$/;

// Indexed by the form field's position, which the API reports back as `invalid_field` (0 name … 3 message).
const MISSING = Object.freeze([
  new LocalizedText('You did not enter your name!', 'İsminizi girmediniz!'),
  new LocalizedText('You did not enter your email address!', 'EPosta adresinizi girmediniz!'),
  new LocalizedText('You did not enter the subject!', 'İleti konusunu girmediniz!'),
  new LocalizedText('You did not enter the message!', 'İletiyi girmediniz!'),
]);
const BAD_EMAIL = new LocalizedText('Your email address is not in the correct format!', 'EPosta adresiniz doğru biçimde değil!');

/** A message sent with the website's contact form (or an old ulak.js client); `language` is a Language. */
export class ContactMessage
{
  constructor({ id = null, name, email, subject, message, language, isRead = false, createdAt = null })
  {
    Object.assign(this, { id, name, email, subject, message, language, isRead, createdAt });
    Object.freeze(this);
  }

  /** Factory for the public form; fields are checked in form order, so the first invalid one is reported. */
  static create(input, language)
  {
    const name = ContactMessage.#required(input?.name, 0);
    const email = ContactMessage.#email(input?.email);
    const subject = ContactMessage.#required(input?.subject, 2);
    return new ContactMessage({ name, email, subject, message: ContactMessage.#required(input?.message, 3), language });
  }

  static #required(value, field)
  {
    const text = typeof value === 'string' ? value.trim() : '';
    if (!text) throw new LocalizedValidationError(MISSING[field], field);
    return text;
  }

  static #email(value)
  {
    const email = ContactMessage.#required(value, 1);
    if (!EMAIL.test(email)) throw new LocalizedValidationError(BAD_EMAIL, 1);
    return email;
  }
}
