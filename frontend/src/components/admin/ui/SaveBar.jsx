import { errorMessage } from '../../../hooks/admin/errorMessage';
import { useLanguage } from '../../../i18n/useLanguage';
import { buttonClass } from '../../ui/styles';

const STATUS_CLASS = Object.freeze({ error: 'text-ember', saved: 'text-phoenix' });

function statusText(editor, t)
{
  const texts = { dirty: t('You have unsaved changes.', 'Kaydedilmemiş değişiklikler var.'), saved: t('Saved.', 'Kaydedildi.') };
  return editor.status === 'error' ? errorMessage(editor.error, t) : texts[editor.status] ?? '';
}

/** The form's save button with the last save's result; `children` (e.g. a checkbox) sit on its left. */
export function SaveBar({ editor, label, children })
{
  const { t } = useLanguage(), busy = editor.status === 'saving' || editor.status === 'loading';
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 pt-2">{children}
      <div className="flex items-center gap-4 ml-auto"><span className={`text-sm ${STATUS_CLASS[editor.status] ?? 'text-ash/70'}`} role="status">{statusText(editor, t)}</span><button type="button" className={buttonClass('primary')} disabled={busy} onClick={editor.submit}>{editor.status === 'saving' ? t('Saving…', 'Kaydediliyor…') : label ?? t('Save', 'Kaydet')}</button></div>
    </div>
  );
}
