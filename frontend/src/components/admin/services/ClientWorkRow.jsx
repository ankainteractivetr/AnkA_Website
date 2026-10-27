import { Link } from 'react-router';
import { useLanguage } from '../../../i18n/useLanguage';
import { WORK_KINDS } from '../../home/services/workKinds';
import { PANEL } from '../../ui/styles';
import { RowControls } from '../ui/RowControls';
import { badgeClass, chipClass } from '../ui/styles';

function WorkSummary({ work })
{
  const { t, pick } = useLanguage();
  return (
    <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1 flex-wrap"><span className={badgeClass('phoenix')}>{pick(WORK_KINDS[work.media.kind].label)}</span>{!work.isPublished && <span className={badgeClass('muted')}>{t('Draft', 'Taslak')}</span>}</div>
      <Link to={`/admin/services/${work.id}`} className="font-display text-lg tracking-wider text-parchment hover:text-phoenix transition-colors">{work.title}</Link><a href={work.media.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-ash/70 font-mono truncate mt-0.5 hover:text-phoenix">{work.media.url}</a>
    </div>
  );
}

function WorkActions({ work, index, works, actions })
{
  const { t } = useLanguage(), remove = () => window.confirm(t(`Delete "${work.title}"?`, `"${work.title}" silinsin mi?`)) && actions.remove(work);
  return (
    <div className="flex items-center gap-2 shrink-0 flex-wrap">
      <button type="button" onClick={() => actions.save({ ...work, isPublished: !work.isPublished })} className={chipClass(work.isPublished ? 'accent' : 'muted')}>{work.isPublished ? t('Published', 'Yayında') : t('Publish', 'Yayınla')}</button>
      <Link to={`/admin/services/${work.id}`} className={chipClass('neutral')}>{t('Edit', 'Düzenle')}</Link><RowControls index={index} count={works.length} onMove={(position, delta) => actions.move(works, position, delta)} onRemove={remove} />
    </div>
  );
}

/** One work of the CMS list: its kind, title and address, with publish / edit / move / delete. */
export function ClientWorkRow({ work, index, works, actions })
{
  return <div className={`${PANEL} p-4 flex flex-col sm:flex-row sm:items-center gap-4`}><WorkSummary work={work} /><WorkActions work={work} index={index} works={works} actions={actions} /></div>;
}
