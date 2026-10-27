import { useLanguage } from '../../../i18n/useLanguage';

const TAB = 'px-4 py-3 text-xs tracking-[0.2em] uppercase border-b-2 -mb-px transition-all whitespace-nowrap border-transparent text-ash/70 hover:text-parchment aria-selected:border-ember aria-selected:text-phoenix';
const BADGE = 'ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-ember text-ink-900 text-[10px] font-bold';

function tabsOf(submissions, t)
{
  const count = (key) => submissions[key].list.items?.length ?? 0;
  const unread = submissions.messages.list.items?.filter((message) => !message.isRead).length ?? 0;
  return [
    { key: 'messages', label: t('Contact Messages', 'İletişim Mesajları'), count: count('messages'), badge: unread },
    { key: 'feedbacks', label: t('Game Feedbacks', 'Oyun Geri Bildirimleri'), count: count('feedbacks'), badge: 0 },
    { key: 'scores', label: t('High Scores', 'Yüksek Skorlar'), count: count('scores'), badge: 0 },
  ];
}

/** One tab per list with its size; the messages tab also shows how many are unread. */
export function SubmissionTabs({ tab, onChange, submissions })
{
  const { t } = useLanguage();
  return (
    <div className="border-b border-white/10 overflow-x-auto"><div className="flex gap-1 min-w-max" role="tablist">
      {tabsOf(submissions, t).map((item) => <button key={item.key} type="button" role="tab" aria-selected={item.key === tab} className={TAB} onClick={() => onChange(item.key)}>{item.label}<span className="ml-2 text-ash/50">({item.count})</span>{item.badge > 0 && <span className={BADGE}>{item.badge}</span>}</button>)}
    </div></div>
  );
}
