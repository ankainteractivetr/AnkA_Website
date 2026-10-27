import { HostName } from '../../../domain/HostName';
import { useLanguage } from '../../../i18n/useLanguage';
import { Icon } from '../../ui/Icon';
import { WORK_KINDS } from './workKinds';

const DOT = 'w-2.5 h-2.5 rounded-full';
const OPEN_LINK = 'inline-flex items-center gap-1.5 shrink-0 font-heading text-sm tracking-widest uppercase text-phoenix hover:text-phoenix-light transition-colors';

/** A browser-like bar over the frame: the work's address, and a link opening it in a new tab (for sites that refuse frames). */
function AddressBar({ media })
{
  const { t } = useLanguage();
  return (
    <div className="h-11 shrink-0 flex items-center gap-3 px-4 border-b border-ink-400/60 bg-ink-800/60">
      <span className="flex gap-1.5" aria-hidden="true"><span className={`${DOT} bg-ember`} /><span className={`${DOT} bg-phoenix`} /><span className={`${DOT} bg-ash/60`} /></span>
      <span className="flex-1 min-w-0 truncate px-3 py-1 rounded-xs bg-ink-900/70 font-mono text-xs text-ash">{HostName.of(media.url)}</span><a href={media.url} target="_blank" rel="noopener noreferrer" className={OPEN_LINK}>{t('Open', 'Aç')}<Icon name="external" size={14} /></a>
    </div>
  );
}

/** The right column: the chosen work live in a frame, its website or its video (see WORK_KINDS). */
export function WorkFrame({ work })
{
  const { className, ...frame } = WORK_KINDS[work.media.kind].frame;
  return (
    <div className="min-w-0 flex flex-col">
      <AddressBar media={work.media} /><iframe key={work.id} src={work.media.embedUrl} title={work.title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" className={`block w-full border-0 bg-ink-900 ${className}`} {...frame} />
    </div>
  );
}
