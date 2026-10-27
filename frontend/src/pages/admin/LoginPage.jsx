import { useState } from 'react';
import { useAuth } from '../../auth/useAuth';
import { TextField } from '../../components/admin/ui/TextField';
import { Notice } from '../../components/admin/ui/Notice';
import { buttonClass, PANEL } from '../../components/ui/styles';
import { errorMessage } from '../../hooks/admin/errorMessage';
import { useLanguage } from '../../i18n/useLanguage';

const EMPTY_FORM = Object.freeze({ username: '', password: '', error: '', busy: false });
const loginError = (error, t) => (error?.response?.status === 401 ? t('Invalid username or password.', 'Kullanıcı adı veya parola hatalı.') : errorMessage(error, t));

function useLoginForm()
{
  const { login } = useAuth(), { t } = useLanguage(), [form, setForm] = useState(EMPTY_FORM);
  const onFailure = (error) => setForm((current) => ({ ...current, password: '', busy: false, error: loginError(error, t) }));
  const submit = (event) => { event.preventDefault(); setForm({ ...form, busy: true, error: '' }); login(form.username, form.password).catch(onFailure); };
  return [form, setForm, submit];
}

function LoginFields({ form, setForm })
{
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <TextField label={t('Username', 'Kullanıcı Adı')} autoComplete="username" autoFocus required value={form.username} onChange={(username) => setForm({ ...form, username })} />
      <TextField label={t('Password', 'Parola')} type="password" autoComplete="current-password" required value={form.password} onChange={(password) => setForm({ ...form, password })} /><Notice kind="error">{form.error}</Notice>
    </div>
  );
}

/** Shown by <RequireAuth /> in place of any CMS page while nobody is signed in; a successful login reveals that page. */
export function LoginPage()
{
  const [form, setForm, submit] = useLoginForm(), { t } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"><form onSubmit={submit} className={`${PANEL} relative z-[2] w-full max-w-md p-8 md:p-10 space-y-8`}>
      <div className="flex flex-col items-center"><img src="/AnkA-Interactive-Logo.png" alt="AnkA Interactive" className="h-16 w-auto mb-4 opacity-90" /><h1 className="font-display text-2xl tracking-[0.2em] uppercase text-parchment">{t('CMS Login', 'CMS Girişi')}</h1><p className="text-ash/70 text-sm mt-2 tracking-wider">{t('Studio control room', 'Stüdyo kontrol odası')}</p></div>
      <LoginFields form={form} setForm={setForm} /><button type="submit" disabled={form.busy} className={buttonClass('primary', 'w-full')}>{form.busy ? t('Signing in…', 'Giriş yapılıyor…') : t('Enter the studio', 'Stüdyoya gir')}</button>
    </form></div>
  );
}
