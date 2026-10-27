import { useLanguage } from '../../../i18n/useLanguage';

const EXTERNAL = Object.freeze({ target: '_blank', rel: 'noopener noreferrer' });
const BADGE = 'inline-flex items-center gap-3 px-6 py-3 rounded-md bg-ink-800 border border-ink-400 transition-all duration-300 hover:border-ember hover:shadow-glow-ember-sm';
const WINDOWS_TILES = Object.freeze([['1', '1', '#F25022'], ['13', '1', '#7FBA00'], ['1', '13', '#00A4EF'], ['13', '13', '#FFB900']]);

export function MicrosoftStoreBadge({ url })
{
  const { t } = useLanguage();
  return (
    <div className="text-center mt-6"><a href={url} {...EXTERNAL} className={BADGE}>
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">{WINDOWS_TILES.map(([x, y, fill]) => <rect key={fill} x={x} y={y} width="10" height="10" fill={fill} />)}</svg>
      <span className="text-left leading-tight"><span className="block text-[10px] uppercase tracking-[0.2em] text-ash/70">{t('Get it from', 'Şuradan edinin')}</span><span className="block font-heading text-base tracking-wide text-parchment">Microsoft Store</span></span>
    </a></div>
  );
}

/** SourceForge's own download badge, linking to the project's SourceForge page. */
export function SourceForgeBadge({ name, groupId, title })
{
  const { t } = useLanguage();
  const badge = <img alt={`${t('Download', 'İndir')} ${title}`} src={`https://sourceforge.net/sflogo.php?type=18&group_id=${encodeURIComponent(groupId)}`} width="200" />;
  return <div className="text-center mt-6"><a href={`https://sourceforge.net/p/${encodeURIComponent(name)}/`} {...EXTERNAL} className="inline-block rounded-md overflow-hidden border border-transparent transition-all duration-300 hover:border-ember hover:shadow-glow-ember-sm">{badge}</a></div>;
}

export function SteamWidget({ url })
{
  const { t } = useLanguage();
  return (
    <div className="mt-10"><p className="text-center font-heading tracking-[0.2em] text-ash mb-4">{t('AVAILABLE ON', 'ŞURADA MEVCUT')}</p>
      <div className="max-w-3xl mx-auto"><iframe src={url} width="100%" height="190" title="Steam" className="rounded-xs border-0" /></div>
    </div>
  );
}
