import { useLanguage } from '../../../i18n/useLanguage';
import { Icon } from '../../ui/Icon';
import { WORK_KINDS } from './workKinds';

const ITEM = 'w-full flex items-center gap-3 px-5 py-4 text-left border-l-2 border-transparent transition-all duration-200 text-ash hover:text-parchment hover:bg-parchment/5 '
  + 'aria-pressed:border-ember aria-pressed:bg-ember/10 aria-pressed:text-phoenix';

function WorkItem({ work, selected, onSelect })
{
  const { t } = useLanguage(), kind = WORK_KINDS[work.media.kind];
  return (
    <li><button type="button" className={ITEM} aria-pressed={selected} onClick={() => onSelect(work.id)}>
      <Icon name={kind.icon} size={18} className="shrink-0" /><span className="min-w-0"><span className="block font-heading text-xl tracking-wider truncate">{work.title}</span><span className="block text-xs text-ash/70 truncate">{kind.caption(work.media, t)}</span></span>
    </button></li>
  );
}

/** The left column: every work by name; choosing one shows it in the frame. */
export function WorkList({ works, selectedId, onSelect })
{
  const { t } = useLanguage();
  return (
    <div className="min-w-0 flex flex-col">
      <div className="h-11 shrink-0 flex items-center px-5 border-b border-ink-400/60 bg-ink-800/60 font-heading text-sm tracking-[0.3em] uppercase text-ember">{t('Our Work', 'İşlerimiz')}</div>
      <ul className="max-h-64 lg:max-h-[600px] overflow-y-auto divide-y divide-ink-400/40">{works.map((work) => <WorkItem key={work.id} work={work} selected={work.id === selectedId} onSelect={onSelect} />)}</ul>
    </div>
  );
}
