/** A contact form submission, sent in the field names of the old ulak.js form that the API keeps accepting. */
export class ContactRequest
{
  #fields;

  constructor(fields)
  {
    this.#fields = Object.freeze(fields);
  }

  /** Reads the form's named fields (name, email, subject, message); `lang` picks the language of the API's answer. */
  static fromForm(form, lang)
  {
    const data = new FormData(form);
    const text = (name) => String(data.get(name) ?? '');
    return new ContactRequest({ name: text('name'), email: text('email'), subject: text('subject'), message: text('message'), lang });
  }

  toJSON()
  {
    const { name, email, subject, message, lang } = this.#fields;
    return { contact_name: name, contact_email: email, contact_subject: subject, contact_message: message, contact_lang: lang === 'tr' ? '1' : '0' };
  }
}
