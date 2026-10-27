import { DateText } from '../../../domain/DateText';
import { useLanguage } from '../../../i18n/useLanguage';
import { PANEL } from '../../ui/styles';
import { chipClass } from '../ui/styles';

function MessageHeader({ message, onToggleOpen })
{
  const { lang } = useLanguage();
  return (
    <button type="button" onClick={onToggleOpen} className="w-full p-4 text-left flex items-start gap-3 hover:bg-white/5 transition-colors"><span className={`mt-1.5 inline-block w-2 h-2 rounded-full shrink-0 ${message.isRead ? 'bg-white/10' : 'bg-ember'}`} />
      <div className="flex-1 min-w-0"><div className="flex items-center justify-between gap-2 flex-wrap"><div><span className={`font-medium ${message.isRead ? 'text-ash' : 'text-parchment'}`}>{message.name}</span><span className="text-ash/50 text-sm ml-2">&lt;{message.email}&gt;</span></div><div className="text-xs text-ash/50">{DateText.dateTime(message.createdAt, lang)}</div></div>
        {message.subject && <div className="text-sm text-phoenix mt-1">{message.subject}</div>}<div className="text-sm text-ash/70 mt-1 line-clamp-1">{message.message}</div></div>
    </button>
  );
}

function MessageBody({ message, onToggleRead, onRemove })
{
  const { t } = useLanguage(), replySubject = encodeURIComponent(`Re: ${message.subject || 'Your message to AnkA Interactive'}`);
  return (
    <div className="border-t border-white/5 p-4 space-y-3"><div className="text-sm text-ash/90 whitespace-pre-wrap leading-relaxed">{message.message}</div>
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5"><a href={`mailto:${message.email}?subject=${replySubject}`} className={chipClass('accent')}>↪ {t('Reply', 'Yanıtla')}</a><button type="button" onClick={onToggleRead} className={chipClass('neutral')}>{message.isRead ? t('Mark Unread', 'Okunmadı Yap') : t('Mark Read', 'Okundu Yap')}</button><button type="button" onClick={onRemove} className={chipClass('danger', 'ml-auto')}>{t('Delete', 'Sil')}</button></div>
    </div>
  );
}

/** A contact message: its summary, which opens to the full text with reply / read / delete actions. */
export function MessageItem({ message, open, onToggleOpen, onToggleRead, onRemove })
{
  return <div className={`${PANEL} ${message.isRead ? '' : 'border-ember/30'}`}><MessageHeader message={message} onToggleOpen={onToggleOpen} />{open && <MessageBody message={message} onToggleRead={onToggleRead} onRemove={onRemove} />}</div>;
}
