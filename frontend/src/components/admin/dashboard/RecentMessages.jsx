import { Link } from 'react-router';
import { DateText } from '../../../domain/DateText';
import { useLanguage } from '../../../i18n/useLanguage';
import { PANEL } from '../../ui/styles';
import { CARD_TITLE } from '../ui/styles';

function MessagePreview({ message })
{
  const { lang } = useLanguage();
  return (
    <div className="p-4 flex items-start gap-3">{!message.isRead && <span className="mt-1.5 inline-block w-2 h-2 rounded-full bg-ember shrink-0" />}
      <div className="flex-1 min-w-0"><div className="flex items-center justify-between gap-2 flex-wrap"><div className="text-parchment font-medium truncate">{message.name}</div><div className="text-xs text-ash/50 shrink-0">{DateText.date(message.createdAt, lang)}</div></div>
        <div className="text-xs text-ash/60 truncate">{message.email}</div><div className="text-sm text-ash/80 mt-1 line-clamp-2">{message.message}</div></div>
    </div>
  );
}

function MessageList({ stats })
{
  const { t } = useLanguage();
  if (!stats) return <div className="p-6 text-center text-ash/60">{t('Loading…', 'Yükleniyor…')}</div>;
  if (stats.recentMessages.length === 0) return <div className="p-6 text-center text-ash/60">{t('No messages yet.', 'Henüz mesaj yok.')}</div>;
  return stats.recentMessages.map((message) => <MessagePreview key={message.id} message={message} />);
}

/** The dashboard's latest contact messages. */
export function RecentMessages({ stats })
{
  const { t } = useLanguage();
  return (
    <section><div className="flex items-center justify-between mb-4"><h2 className={CARD_TITLE}>{t('Recent Messages', 'Son Mesajlar')}</h2><Link to="/admin/submissions" className="text-xs text-phoenix hover:text-ember tracking-wider uppercase">{t('View all →', 'Tümünü gör →')}</Link></div>
      <div className={`${PANEL} divide-y divide-white/5`}><MessageList stats={stats} /></div>
    </section>
  );
}
