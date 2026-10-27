import { useLanguage } from '../../i18n/useLanguage';
import { NAV_LINKS } from './navigation';

const DESKTOP_LINK = 'relative group font-heading text-base uppercase tracking-[0.2em] text-ash hover:text-parchment transition-colors';
const UNDERLINE = 'absolute -bottom-1 left-0 w-0 h-[2px] bg-linear-to-r from-ember to-phoenix group-hover:w-full transition-all duration-300';
const MOBILE_LINK = 'block px-6 py-4 font-heading text-base uppercase tracking-[0.2em] text-parchment hover:text-ember hover:bg-ink-700/50 transition-colors';

export function DesktopLinks()
{
  const { pick } = useLanguage();
  return <ul className="hidden md:flex items-center gap-5 lg:gap-7">{NAV_LINKS.map((link) => <li key={link.href}><a href={link.href} className={DESKTOP_LINK}>{pick(link.label)}<span className={UNDERLINE} /></a></li>)}</ul>;
}

/** The phone menu, open under the bar; following a link closes it (onNavigate). */
export function MobileLinks({ onNavigate })
{
  const { pick } = useLanguage();
  return (
    <ul className="md:hidden border-t border-ink-400/70 bg-ink-900/95 backdrop-blur-xl">
      {NAV_LINKS.map((link) => <li key={link.href} className="border-b border-ink-400/40 last:border-b-0"><a href={link.href} onClick={onNavigate} className={MOBILE_LINK}>{pick(link.label)}</a></li>)}
    </ul>
  );
}
