import { useContactForm } from '../../../hooks/useContactForm';
import { useLanguage } from '../../../i18n/useLanguage';
import { contactService } from '../../../services';
import { buttonClass, INPUT } from '../../ui/styles';

const FIELDS = Object.freeze([
  { name: 'name', type: 'text', autoComplete: 'name', label: { en: 'Name', tr: 'İsim' } },
  { name: 'email', type: 'email', autoComplete: 'email', label: { en: 'Email', tr: 'EPosta' } },
  { name: 'subject', type: 'text', autoComplete: 'off', label: { en: 'Subject', tr: 'Konu' } },
]);
const STATUS_STYLES = Object.freeze({ sent: 'bg-emerald-900/20 border-emerald-700/50 text-emerald-200', failed: 'bg-red-900/20 border-red-700/50 text-red-200' });

function FormStatus({ status, message })
{
  if (!message) return null;
  return <div className={`p-4 rounded-xs border ${STATUS_STYLES[status]}`} role={status === 'failed' ? 'alert' : 'status'}>{message}</div>;
}

function FormButtons({ busy })
{
  const { t } = useLanguage();
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
      <button type="submit" disabled={busy} className={buttonClass('primary')}>{busy ? t('Sending…', 'Gönderiliyor…') : t('Send', 'Gönder')}</button><button type="reset" disabled={busy} className={buttonClass('ghost')}>{t('Reset', 'Sıfırla')}</button>
    </div>
  );
}

/** The contact form; the API checks the fields and answers in the visitor's language. */
export function ContactForm()
{
  const form = useContactForm(contactService), { t, pick } = useLanguage(), messageLabel = t('Message', 'İleti');
  return (
    <form className="max-w-2xl mx-auto space-y-3" onSubmit={form.submit} onReset={form.reset} noValidate>
      {FIELDS.map((field) => <input key={field.name} name={field.name} type={field.type} autoComplete={field.autoComplete} placeholder={pick(field.label)} aria-label={pick(field.label)} className={INPUT} />)}
      <textarea name="message" rows="8" placeholder={messageLabel} aria-label={messageLabel} className={`${INPUT} resize-none`} /><FormStatus status={form.status} message={form.message} /><FormButtons busy={form.status === 'sending'} />
    </form>
  );
}
