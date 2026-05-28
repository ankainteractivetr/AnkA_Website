import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from '../../components/LanguageToggle';
import { useState } from 'react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', end: true, label: t('Dashboard', 'Pano'), icon: '◈' },
    { to: '/admin/about', label: t('About', 'Hakkında'), icon: '✦' },
    { to: '/admin/projects', label: t('Projects', 'Projeler'), icon: '⬡' },
    { to: '/admin/contact', label: t('Contact', 'İletişim'), icon: '✉' },
    { to: '/admin/submissions', label: t('Submissions', 'Gönderiler'), icon: '⚑' },
  ];

  return (
    <div className="min-h-screen flex bg-ink-900">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-ink-900/95 backdrop-blur border-b border-white/5 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/AnkA-Interactive-Logo.png" alt="" className="h-8 w-auto" />
          <span className="font-display text-sm tracking-[0.25em] uppercase">CMS</span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="p-2 text-parchment"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:sticky top-0 left-0 h-screen
          w-72 z-30 transition-transform duration-300
          bg-gradient-to-b from-ink-800 to-ink-900 border-r border-white/5
          flex flex-col
        `}
      >
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <img src="/AnkA-Interactive-Logo.png" alt="" className="h-10 w-auto" />
            <div>
              <div className="font-display text-base tracking-[0.25em] uppercase text-parchment">
                AnkA
              </div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-ash/60">
                {t('Control Room', 'Kontrol Odası')}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-md
                font-display text-sm tracking-[0.18em] uppercase
                transition-all
                ${
                  isActive
                    ? 'bg-ember/15 text-phoenix border-l-2 border-ember'
                    : 'text-ash/80 hover:text-parchment hover:bg-white/5 border-l-2 border-transparent'
                }
              `}
            >
              <span className="text-phoenix text-base w-4">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs">
              <div className="text-ash/60 uppercase tracking-wider">
                {t('Signed in as', 'Giriş yapılan')}
              </div>
              <div className="text-parchment font-medium mt-0.5">
                {user?.username}
              </div>
            </div>
            <LanguageToggle />
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-xs tracking-[0.2em] uppercase text-ash/70 hover:text-phoenix transition-colors py-2 border border-white/5 rounded"
          >
            {t('View site ↗', 'Siteyi gör ↗')}
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-center text-xs tracking-[0.2em] uppercase text-ember hover:bg-ember/10 transition-colors py-2 border border-ember/30 rounded"
          >
            {t('Logout', 'Çıkış')}
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-20"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-0 mt-14 lg:mt-0 min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
