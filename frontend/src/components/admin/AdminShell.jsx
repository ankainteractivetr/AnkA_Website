import { Outlet } from 'react-router';
import { useToggle } from '../../hooks/useToggle';
import { useLanguage } from '../../i18n/useLanguage';
import { Icon } from '../ui/Icon';
import { Sidebar } from './Sidebar';

function MobileTopBar({ open, onToggle })
{
  const { t } = useLanguage();
  return (
    <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-ink-900/95 backdrop-blur border-b border-white/5 px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-3"><img src="/AnkA-Interactive-Logo.png" alt="" className="h-8 w-auto" /><span className="font-display text-sm tracking-[0.25em] uppercase">CMS</span></div>
      <button type="button" onClick={onToggle} className="p-2 text-parchment" aria-expanded={open} aria-label={t('Toggle menu', 'Menüyü aç / kapat')}><Icon name={open ? 'close' : 'menu'} /></button>
    </div>
  );
}

/** CMS frame: the sidebar with its sections, the current section on the right. */
export function AdminShell()
{
  const [open, toggle, close] = useToggle();
  return (
    <div className="min-h-screen flex bg-ink-900">
      <MobileTopBar open={open} onToggle={toggle} /><Sidebar open={open} onNavigate={close} />{open && <div className="lg:hidden fixed inset-0 bg-black/60 z-20" onClick={close} aria-hidden="true" />}
      <main className="relative z-[2] flex-1 mt-14 lg:mt-0 min-w-0"><div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 lg:py-12"><Outlet /></div></main>
    </div>
  );
}
