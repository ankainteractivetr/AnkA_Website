import { Link } from 'react-router';
import { RecentMessages } from '../../components/admin/dashboard/RecentMessages';
import { AdminPage } from '../../components/admin/ui/AdminPage';
import { CARD_TITLE } from '../../components/admin/ui/styles';
import { PANEL } from '../../components/ui/styles';
import { DashboardStats } from '../../domain/DashboardStats';
import { useDashboard } from '../../hooks/admin/useDashboard';
import { useLanguage } from '../../i18n/useLanguage';

const CARD_LINK = `${PANEL} p-5 transition-all hover:shadow-glow-ember-sm`;

function statCards(stats, t)
{
  return [
    { label: t('Total Projects', 'Toplam Proje'), value: stats.projects, sub: t(`${stats.games} games · ${stats.software} software`, `${stats.games} oyun · ${stats.software} yazılım`), to: '/admin/projects', tone: 'text-phoenix' },
    { label: t('Messages', 'Mesajlar'), value: stats.messages, sub: t(`${stats.unread} unread`, `${stats.unread} okunmamış`), to: '/admin/submissions', tone: 'text-ember' },
    { label: t('Game Feedbacks', 'Oyun Geri Bildirimleri'), value: stats.feedbacks, sub: t('In-game submissions', 'Oyun içi gönderiler'), to: '/admin/submissions', tone: 'text-phoenix' },
    { label: t('High Scores', 'Yüksek Skorlar'), value: stats.highScores, sub: t('Leaderboard entries', 'Liderlik tablosu'), to: '/admin/submissions', tone: 'text-ember' },
  ];
}

function StatCards({ stats })
{
  const { t } = useLanguage();
  return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{statCards(stats ?? DashboardStats.EMPTY, t).map((card) => <Link key={card.label} to={card.to} className={CARD_LINK}><div className="text-[10px] tracking-[0.3em] uppercase text-ash/70 mb-3">{card.label}</div><div className={`font-display text-4xl md:text-5xl tracking-wider ${card.tone}`}>{stats ? card.value : '—'}</div><div className="text-xs text-ash/60 mt-2">{card.sub}</div></Link>)}</div>;
}

function quickActions(t)
{
  return [
    { to: '/admin/projects/new', icon: '＋', title: t('Add Project', 'Proje Ekle'), sub: t('Game or software', 'Oyun veya yazılım') },
    { to: '/admin/services/new', icon: '❖', title: t('Add Service Work', 'Hizmet İşi Ekle'), sub: t('Website or app video', 'Web sitesi veya uygulama videosu') },
    { to: '/admin/about', icon: '✎', title: t('Edit About', 'Hakkında Düzenle'), sub: t('Story & gallery', 'Hikaye & galeri') },
    { to: '/admin/contact', icon: '⌖', title: t('Contact & Social', 'İletişim & Sosyal'), sub: t('Update info & links', 'Bilgi & link güncelle') },
  ];
}

function QuickActions()
{
  const { t } = useLanguage();
  return (
    <section><h2 className={`${CARD_TITLE} mb-4`}>{t('Quick Actions', 'Hızlı İşlemler')}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{quickActions(t).map((action) => <Link key={action.to} to={action.to} className={CARD_LINK}><div className="text-phoenix text-xl">{action.icon}</div><div className="font-display text-sm tracking-wider uppercase mt-2">{action.title}</div><div className="text-xs text-ash/60 mt-1">{action.sub}</div></Link>)}</div>
    </section>
  );
}

export function DashboardPage()
{
  const { t } = useLanguage(), stats = useDashboard();
  return <AdminPage eyebrow={t('Studio Overview', 'Stüdyo Genel Bakış')} title={t('Dashboard', 'Pano')}><StatCards stats={stats} /><QuickActions /><RecentMessages stats={stats} /></AdminPage>;
}
