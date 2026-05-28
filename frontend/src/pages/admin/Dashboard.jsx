import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';

export default function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    projects: 0,
    games: 0,
    software: 0,
    unreadMessages: 0,
    totalMessages: 0,
    feedbacks: 0,
    highScores: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [projectsRes, messagesRes, feedbacksRes, scoresRes] = await Promise.all([
          api.get('/admin/projects'),
          api.get('/admin/messages'),
          api.get('/admin/feedbacks'),
          api.get('/admin/high-scores'),
        ]);

        const projects = projectsRes.data || [];
        const messages = messagesRes.data || [];

        setStats({
          projects: projects.length,
          games: projects.filter((p) => p.type === 'game').length,
          software: projects.filter((p) => p.type === 'software').length,
          unreadMessages: messages.filter((m) => !m.is_read).length,
          totalMessages: messages.length,
          feedbacks: (feedbacksRes.data || []).length,
          highScores: (scoresRes.data || []).length,
        });

        setRecentMessages(messages.slice(0, 5));
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    {
      label: t('Total Projects', 'Toplam Proje'),
      value: stats.projects,
      sub: t(
        `${stats.games} games · ${stats.software} software`,
        `${stats.games} oyun · ${stats.software} yazılım`
      ),
      to: '/admin/projects',
      color: 'phoenix',
    },
    {
      label: t('Messages', 'Mesajlar'),
      value: stats.totalMessages,
      sub: t(
        `${stats.unreadMessages} unread`,
        `${stats.unreadMessages} okunmamış`
      ),
      to: '/admin/submissions',
      color: 'ember',
    },
    {
      label: t('Game Feedbacks', 'Oyun Geri Bildirimleri'),
      value: stats.feedbacks,
      sub: t('In-game submissions', 'Oyun içi gönderiler'),
      to: '/admin/submissions',
      color: 'phoenix',
    },
    {
      label: t('High Scores', 'Yüksek Skorlar'),
      value: stats.highScores,
      sub: t('Leaderboard entries', 'Liderlik tablosu'),
      to: '/admin/submissions',
      color: 'ember',
    },
  ];

  return (
    <div>
      <header className="mb-10">
        <div className="text-phoenix text-xs tracking-[0.4em] uppercase mb-2">
          {t('Studio Overview', 'Stüdyo Genel Bakış')}
        </div>
        <h1 className="font-display text-3xl md:text-4xl tracking-wider uppercase text-parchment">
          {t('Dashboard', 'Pano')}
        </h1>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c, i) => (
          <Link
            key={i}
            to={c.to}
            className="card-panel p-5 hover:border-ember/40 transition-all group"
          >
            <div className="text-[10px] tracking-[0.3em] uppercase text-ash/70 mb-3">
              {c.label}
            </div>
            <div
              className={`font-display text-4xl md:text-5xl tracking-wider ${
                c.color === 'phoenix' ? 'text-phoenix' : 'text-ember'
              }`}
            >
              {loading ? '—' : c.value}
            </div>
            <div className="text-xs text-ash/60 mt-2">{c.sub}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <section className="mb-10">
        <h2 className="font-display text-xl tracking-[0.2em] uppercase text-parchment mb-4">
          {t('Quick Actions', 'Hızlı İşlemler')}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link to="/admin/projects/new" className="card-panel p-4 hover:border-ember/40 transition-all">
            <div className="text-phoenix text-xl">＋</div>
            <div className="font-display text-sm tracking-wider uppercase mt-2">
              {t('Add Project', 'Proje Ekle')}
            </div>
            <div className="text-xs text-ash/60 mt-1">
              {t('Game or software', 'Oyun veya yazılım')}
            </div>
          </Link>
          <Link to="/admin/about" className="card-panel p-4 hover:border-ember/40 transition-all">
            <div className="text-phoenix text-xl">✎</div>
            <div className="font-display text-sm tracking-wider uppercase mt-2">
              {t('Edit About', 'Hakkında Düzenle')}
            </div>
            <div className="text-xs text-ash/60 mt-1">
              {t('Story & gallery', 'Hikaye & galeri')}
            </div>
          </Link>
          <Link to="/admin/contact" className="card-panel p-4 hover:border-ember/40 transition-all">
            <div className="text-phoenix text-xl">⌖</div>
            <div className="font-display text-sm tracking-wider uppercase mt-2">
              {t('Contact & Social', 'İletişim & Sosyal')}
            </div>
            <div className="text-xs text-ash/60 mt-1">
              {t('Update info & links', 'Bilgi & link güncelle')}
            </div>
          </Link>
        </div>
      </section>

      {/* Recent messages */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl tracking-[0.2em] uppercase text-parchment">
            {t('Recent Messages', 'Son Mesajlar')}
          </h2>
          <Link to="/admin/submissions" className="text-xs text-phoenix hover:text-ember tracking-wider uppercase">
            {t('View all →', 'Tümünü gör →')}
          </Link>
        </div>
        <div className="card-panel divide-y divide-white/5">
          {loading ? (
            <div className="p-6 text-center text-ash/60">{t('Loading…', 'Yükleniyor…')}</div>
          ) : recentMessages.length === 0 ? (
            <div className="p-6 text-center text-ash/60">
              {t('No messages yet.', 'Henüz mesaj yok.')}
            </div>
          ) : (
            recentMessages.map((m) => (
              <div key={m.id} className="p-4 flex items-start gap-3">
                {!m.is_read && (
                  <span className="mt-1.5 inline-block w-2 h-2 rounded-full bg-ember shadow-glow flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="text-parchment font-medium truncate">{m.name}</div>
                    <div className="text-xs text-ash/50 flex-shrink-0">
                      {new Date(m.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-xs text-ash/60 truncate">{m.email}</div>
                  <div className="text-sm text-ash/80 mt-1 line-clamp-2">{m.message}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
