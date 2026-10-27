import { useScrolledPast } from '../../hooks/useScrolledPast';
import { useToggle } from '../../hooks/useToggle';
import { useLanguage } from '../../i18n/useLanguage';
import { Icon } from '../ui/Icon';
import { LanguageToggle } from '../ui/LanguageToggle';
import { DesktopLinks, MobileLinks } from './NavLinks';

const SCROLL_OFFSET_PX = 30;
const BAR = 'sticky top-0 z-40 w-full transition-all duration-300';
const BAR_SCROLLED = 'bg-ink-900/85 backdrop-blur-xl border-b border-ink-400/70 shadow-[0_8px_30px_-15px_rgb(0_0_0/0.9)]';
const BAR_TOP = 'bg-ink-900/40 backdrop-blur-xs border-b border-transparent';

function Brand()
{
  return (
    <a href="#top" className="flex items-center gap-3 group">
      <img src="/AnkA-Interactive-Logo.png" alt="AnkA" className="w-10 h-10 transition-transform duration-300 group-hover:rotate-[8deg]" />
      <div className="hidden sm:block leading-none"><div className="font-display text-lg text-parchment tracking-wider">AnkA</div><div className="font-heading text-xs text-ember tracking-[0.3em]">INTERACTIVE</div></div>
    </a>
  );
}

function MenuButton({ open, onToggle })
{
  const { t } = useLanguage();
  return <button type="button" className="md:hidden text-parchment p-2" onClick={onToggle} aria-expanded={open} aria-label={t('Toggle menu', 'Menüyü aç / kapat')}><Icon name={open ? 'close' : 'menu'} size={22} /></button>;
}

/** Sticky bar over the page; it turns solid once the page is scrolled. */
export function Navbar()
{
  const scrolled = useScrolledPast(SCROLL_OFFSET_PX), [open, toggle, close] = useToggle();
  return (
    <nav className={`${BAR} ${scrolled ? BAR_SCROLLED : BAR_TOP}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between"><Brand /><DesktopLinks /><div className="flex items-center gap-3"><LanguageToggle /><MenuButton open={open} onToggle={toggle} /></div></div>
      {open && <MobileLinks onNavigate={close} />}
    </nav>
  );
}
