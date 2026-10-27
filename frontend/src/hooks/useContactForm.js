import { useCallback, useState } from 'react';
import { ContactRequest } from '../domain/ContactRequest';
import { useLanguage } from '../i18n/useLanguage';

const IDLE = Object.freeze({ status: 'idle', message: '' });
const SENDING = Object.freeze({ status: 'sending', message: '' });

/** The API's answer (in the visitor's language) on success: the form is emptied. */
const sent = (form) => (message) => { form.reset(); return { status: 'sent', message }; };
const failed = (t) => (error) => ({ status: 'failed', message: error?.response?.data?.message || t('Network error. Please try again.', 'Bağlantı hatası. Lütfen tekrar deneyin.') });

async function sendForm({ contactService, lang, t }, event, setState)
{
  event.preventDefault();
  const form = event.currentTarget;
  setState(SENDING);
  setState(await contactService.send(ContactRequest.fromForm(form, lang)).then(sent(form), failed(t)));
}

/** State of the contact form: idle → sending → sent | failed, with the message to show; reset() clears it. */
export function useContactForm(contactService)
{
  const { lang, t } = useLanguage();
  const [state, setState] = useState(IDLE);
  const submit = useCallback((event) => sendForm({ contactService, lang, t }, event, setState), [contactService, lang, t]);
  const reset = useCallback(() => setState(IDLE), []);
  return { ...state, submit, reset };
}
