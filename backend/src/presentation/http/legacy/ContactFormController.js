import { LocalizedValidationError } from '../../../domain/errors.js';
import { Language } from '../../../domain/value-objects/Language.js';
import { LocalizedText } from '../../../domain/value-objects/LocalizedText.js';

const SENT = new LocalizedText('We received your message successfully and we will get back to you ASAP. Thank You.', 'İletiniz bize başarıyla ulaştı ve en kısa sürede dönüş yapacağız. Teşekkür ederiz.');

/**
 * POST /api/contact (and /api/ulak): the contact form, in the field names of the old ulak.js form.
 * Answers { success: true, message }, or 400 { success: false, message, invalid_field } in the visitor's language.
 */
export class ContactFormController
{
  #submit;

  constructor(submitContactMessage)
  {
    this.#submit = submitContactMessage;
  }

  submit = async (req, res, next) =>
  {
    const language = Language.fromLegacyCode(req.body?.contact_lang) ?? Language.EN;
    await this.#submit.execute({ input: ContactFormController.#inputOf(req.body), language }).then(
      () => res.json({ success: true, message: language.pick(SENT) }),
      (error) => ContactFormController.#reject(error, language, res, next));
  };

  static #inputOf(body)
  {
    return { name: body?.contact_name, email: body?.contact_email, subject: body?.contact_subject, message: body?.contact_message };
  }

  static #reject(error, language, res, next)
  {
    if (!(error instanceof LocalizedValidationError)) return next(error);
    res.status(400).json({ success: false, message: language.pick(error.text), invalid_field: error.field });
  }
}
