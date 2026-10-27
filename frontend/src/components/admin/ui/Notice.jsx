import { errorMessage } from '../../../hooks/admin/errorMessage';
import { useLanguage } from '../../../i18n/useLanguage';
import { PANEL } from '../../ui/styles';

const KINDS = Object.freeze({ success: 'border-phoenix/40 bg-phoenix/10 text-phoenix', error: 'border-ember/40 bg-ember/10 text-ember' });

/** A highlighted line of feedback; nothing when there is no text. */
export function Notice({ kind = 'error', children })
{
  if (!children) return null;
  return <div className={`px-4 py-3 rounded-sm border text-sm ${KINDS[kind]}`} role={kind === 'error' ? 'alert' : 'status'}>{children}</div>;
}

/** The message of a failed request (see errorMessage); nothing while there is no error. */
export function ErrorNotice({ error })
{
  const { t } = useLanguage();
  return <Notice kind="error">{errorMessage(error, t)}</Notice>;
}

export function Loading()
{
  const { t } = useLanguage();
  return <div className="text-ash/70 text-center py-12">{t('Loading…', 'Yükleniyor…')}</div>;
}

/** The placeholder of an empty list. */
export function EmptyState({ children })
{
  return <div className={`${PANEL} p-12 text-center text-ash/60`}>{children}</div>;
}
