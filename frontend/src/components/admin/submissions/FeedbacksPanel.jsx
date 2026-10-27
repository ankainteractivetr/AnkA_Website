import { DateText } from '../../../domain/DateText';
import { useLanguage } from '../../../i18n/useLanguage';
import { PANEL } from '../../ui/styles';
import { EmptyState, Loading } from '../ui/Notice';
import { chipClass } from '../ui/styles';

function FeedbackItem({ feedback, onRemove })
{
  const { t, lang } = useLanguage();
  return (
    <div className={`${PANEL} p-4`}>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-2"><span className="text-[10px] tracking-[0.25em] uppercase px-2 py-0.5 rounded bg-phoenix/15 text-phoenix border border-phoenix/30">{t('Game', 'Oyun')} #{feedback.gameId}</span><div className="flex items-center gap-3"><div className="text-xs text-ash/50">{DateText.dateTime(feedback.createdAt, lang)}</div><button type="button" onClick={onRemove} className={chipClass('danger')} aria-label={t('Delete', 'Sil')}>✕</button></div></div>
      <div className="text-sm text-ash/90 whitespace-pre-wrap">{feedback.message}</div>
    </div>
  );
}

/** Feedback sent from inside the games, newest first. */
export function FeedbacksPanel({ list, actions })
{
  const { t } = useLanguage();
  if (list.items === null) return <Loading />;
  if (list.items.length === 0) return <EmptyState>{t('No feedbacks yet.', 'Henüz geri bildirim yok.')}</EmptyState>;
  const remove = (feedback) => window.confirm(t('Delete this feedback?', 'Bu geri bildirim silinsin mi?')) && actions.remove(feedback);
  return <div className="space-y-2">{list.items.map((feedback) => <FeedbackItem key={feedback.id} feedback={feedback} onRemove={() => remove(feedback)} />)}</div>;
}
