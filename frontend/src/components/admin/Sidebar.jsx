import { NavLink } from 'react-router';
import { useAuth } from '../../auth/useAuth';
import { useLanguage } from '../../i18n/useLanguage';
import { LanguageToggle } from '../ui/LanguageToggle';
import { ADMIN_SECTIONS } from './adminSections';

const PANEL = 'fixed lg:sticky top-0 left-0 h-screen w-72 z-30 flex flex-col transition-transform duration-300 lg:translate-x-0 bg-linear-to-b from-ink-800 to-ink-900 border-r border-white/5';
const NAV_LINK = 'flex items-center gap-3 px-4 py-3 rounded-md font-display text-sm tracking-[0.18em] uppercase transition-all border-l-2 border-transparent text-ash/80 hover:text-parchment hover:bg-white/5 '
  + 'aria-[current=page]:bg-ember/15 aria-[current=page]:text-phoenix aria-[current=page]:border-ember';
const FOOT_BUTTON = 'block w-full text-center text-xs tracking-[0.2em] uppercase py-2 rounded border transition-colors';

function SidebarBrand()
{
  const { t } = useLanguage();
  return (
    <div className="p-6 border-b border-white/5 flex items-center gap-3"><img src="/AnkA-Interactive-Logo.png" alt="" className="h-10 w-auto" />
      <div><div className="font-display text-base tracking-[0.25em] uppercase text-parchment">AnkA</div><div className="text-[10px] tracking-[0.3em] uppercase text-ash/60">{t('Control Room', 'Kontrol Odası')}</div></div>
    </div>
  );
}

function SidebarNav({ onNavigate })
{
  const { pick } = useLanguage();
  return <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">{ADMIN_SECTIONS.map((section) => <NavLink key={section.to} to={section.to} end={section.end} onClick={onNavigate} className={NAV_LINK}><span className="text-phoenix text-base w-4">{section.icon}</span><span>{pick(section.label)}</span></NavLink>)}</nav>;
}

function SidebarFooter()
{
  const { user, logout } = useAuth(), { t } = useLanguage();
  return (
    <div className="p-4 border-t border-white/5 space-y-3">
      <div className="flex items-center justify-between"><div className="text-xs"><div className="text-ash/60 uppercase tracking-wider">{t('Signed in as', 'Giriş yapılan')}</div><div className="text-parchment font-medium mt-0.5">{user?.username}</div></div><LanguageToggle /></div>
      <a href="/" target="_blank" rel="noopener noreferrer" className={`${FOOT_BUTTON} text-ash/70 hover:text-phoenix border-white/5`}>{t('View site ↗', 'Siteyi gör ↗')}</a><button type="button" onClick={logout} className={`${FOOT_BUTTON} text-ember hover:bg-ember/10 border-ember/30`}>{t('Logout', 'Çıkış')}</button>
    </div>
  );
}

/** The CMS menu: fixed on large screens, sliding in from the left on phones (`open`). */
export function Sidebar({ open, onNavigate })
{
  return <aside className={`${PANEL} ${open ? 'translate-x-0' : '-translate-x-full'}`}><SidebarBrand /><SidebarNav onNavigate={onNavigate} /><SidebarFooter /></aside>;
}
