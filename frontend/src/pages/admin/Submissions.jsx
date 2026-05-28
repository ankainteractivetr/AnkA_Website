import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';

export default function Submissions() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [m, f, s] = await Promise.all([
        api.get('/admin/messages'),
        api.get('/admin/feedbacks'),
        api.get('/admin/high-scores'),
      ]);
      setMessages(m.data || []);
      setFeedbacks(f.data || []);
      setScores(s.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkRead = async (id, is_read) => {
    try {
      await api.put(`/admin/messages/${id}`, { is_read });
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm(t('Delete this message?', 'Bu mesajı sil?'))) return;
    try {
      await api.delete(`/admin/messages/${id}`);
      load();
    } catch (err) {
      alert(t('Delete failed.', 'Silinemedi.'));
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!confirm(t('Delete this feedback?', 'Bu geri bildirimi sil?'))) return;
    try {
      await api.delete(`/admin/feedbacks/${id}`);
      load();
    } catch (err) {
      alert(t('Delete failed.', 'Silinemedi.'));
    }
  };

  const handleDeleteScore = async (id) => {
    if (!confirm(t('Delete this score?', 'Bu skoru sil?'))) return;
    try {
      await api.delete(`/admin/high-scores/${id}`);
      load();
    } catch (err) {
      alert(t('Delete failed.', 'Silinemedi.'));
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const tabs = [
    {
      key: 'messages',
      label: t('Contact Messages', 'İletişim Mesajları'),
      count: messages.length,
      badge: unreadCount,
    },
    {
      key: 'feedbacks',
      label: t('Game Feedbacks', 'Oyun Geri Bildirimleri'),
      count: feedbacks.length,
    },
    {
      key: 'scores',
      label: t('High Scores', 'Yüksek Skorlar'),
      count: scores.length,
    },
  ];

  return (
    <div>
      <header className="mb-8">
        <div className="text-phoenix text-xs tracking-[0.4em] uppercase mb-2">
          {t('Inbox', 'Gelen Kutusu')}
        </div>
        <h1 className="font-display text-3xl md:text-4xl tracking-wider uppercase text-parchment">
          {t('Submissions', 'Gönderiler')}
        </h1>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/10 mb-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={`px-4 py-3 text-xs tracking-[0.2em] uppercase border-b-2 -mb-px transition-all whitespace-nowrap ${
                tab === tb.key
                  ? 'border-ember text-phoenix'
                  : 'border-transparent text-ash/70 hover:text-parchment'
              }`}
            >
              {tb.label}
              <span className="ml-2 text-ash/50">({tb.count})</span>
              {tb.badge > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-ember text-ink-900 text-[10px] font-bold">
                  {tb.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-ash/70 text-center py-12">{t('Loading…', 'Yükleniyor…')}</div>
      ) : tab === 'messages' ? (
        messages.length === 0 ? (
          <div className="card-panel p-12 text-center text-ash/60">
            {t('No messages yet.', 'Henüz mesaj yok.')}
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((m) => {
              const isOpen = expanded === `m-${m.id}`;
              return (
                <div
                  key={m.id}
                  className={`card-panel transition-all ${!m.is_read ? 'border-ember/30' : ''}`}
                >
                  <button
                    onClick={() => setExpanded(isOpen ? null : `m-${m.id}`)}
                    className="w-full p-4 text-left flex items-start gap-3 hover:bg-white/5 transition-colors"
                  >
                    {!m.is_read ? (
                      <span className="mt-1.5 inline-block w-2 h-2 rounded-full bg-ember flex-shrink-0" />
                    ) : (
                      <span className="mt-1.5 inline-block w-2 h-2 rounded-full bg-white/10 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                          <span className={`font-medium ${!m.is_read ? 'text-parchment' : 'text-ash'}`}>
                            {m.name}
                          </span>
                          <span className="text-ash/50 text-sm ml-2">&lt;{m.email}&gt;</span>
                        </div>
                        <div className="text-xs text-ash/50">
                          {new Date(m.created_at).toLocaleString()}
                        </div>
                      </div>
                      {m.subject && (
                        <div className="text-sm text-phoenix mt-1">{m.subject}</div>
                      )}
                      <div className="text-sm text-ash/70 mt-1 line-clamp-1">
                        {m.message}
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/5 p-4 space-y-3">
                      <div className="text-sm text-ash/90 whitespace-pre-wrap leading-relaxed">
                        {m.message}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                        <a
                          href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'Your message to AnkA Interactive')}`}
                          className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded border border-phoenix/40 text-phoenix hover:bg-phoenix/10"
                        >
                          ↪ {t('Reply', 'Yanıtla')}
                        </a>
                        <button
                          onClick={() => handleMarkRead(m.id, m.is_read ? 0 : 1)}
                          className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded border border-white/20 text-ash hover:border-phoenix hover:text-phoenix"
                        >
                          {m.is_read ? t('Mark Unread', 'Okunmadı Yap') : t('Mark Read', 'Okundu Yap')}
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(m.id)}
                          className="text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded border border-ember/30 text-ember hover:bg-ember/10 ml-auto"
                        >
                          {t('Delete', 'Sil')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : tab === 'feedbacks' ? (
        feedbacks.length === 0 ? (
          <div className="card-panel p-12 text-center text-ash/60">
            {t('No feedbacks yet.', 'Henüz geri bildirim yok.')}
          </div>
        ) : (
          <div className="space-y-2">
            {feedbacks.map((f) => (
              <div key={f.id} className="card-panel p-4">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] tracking-[0.25em] uppercase px-2 py-0.5 rounded bg-phoenix/15 text-phoenix border border-phoenix/30">
                      {t('Game', 'Oyun')} #{f.game_id}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-ash/50">
                      {new Date(f.created_at).toLocaleString()}
                    </div>
                    <button
                      onClick={() => handleDeleteFeedback(f.id)}
                      className="text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded border border-ember/30 text-ember hover:bg-ember/10"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="text-sm text-ash/90 whitespace-pre-wrap">{f.message}</div>
              </div>
            ))}
          </div>
        )
      ) : (
        scores.length === 0 ? (
          <div className="card-panel p-12 text-center text-ash/60">
            {t('No high scores yet.', 'Henüz yüksek skor yok.')}
          </div>
        ) : (
          <div className="card-panel overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left p-3 text-[10px] tracking-[0.2em] uppercase text-ash/70">#</th>
                  <th className="text-left p-3 text-[10px] tracking-[0.2em] uppercase text-ash/70">{t('Player', 'Oyuncu')}</th>
                  <th className="text-left p-3 text-[10px] tracking-[0.2em] uppercase text-ash/70">{t('Game', 'Oyun')}</th>
                  <th className="text-right p-3 text-[10px] tracking-[0.2em] uppercase text-ash/70">{t('Score', 'Skor')}</th>
                  <th className="text-left p-3 text-[10px] tracking-[0.2em] uppercase text-ash/70">{t('Date', 'Tarih')}</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, idx) => (
                  <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                    <td className="p-3 text-ash/60 font-mono text-sm">{idx + 1}</td>
                    <td className="p-3 text-parchment font-medium">{s.player_name}</td>
                    <td className="p-3 text-ash/70 text-sm">#{s.game_id}</td>
                    <td className="p-3 text-right text-phoenix font-display tracking-wider text-lg">
                      {Number(s.high_score).toLocaleString()}
                    </td>
                    <td className="p-3 text-ash/50 text-xs">
                      {new Date(s.updated_at || s.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteScore(s.id)}
                        className="text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded border border-ember/30 text-ember hover:bg-ember/10"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
