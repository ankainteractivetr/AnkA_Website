import { useState } from 'react';
import { ImmutableList } from '../../../domain/ImmutableList';
import { useLanguage } from '../../../i18n/useLanguage';
import { admin } from '../../../services';
import { EmptyState, Loading } from '../ui/Notice';
import { MessageItem } from './MessageItem';

/** Contact messages, newest first; one at a time opens to its full text. */
export function MessagesPanel({ list, actions })
{
  const { t } = useLanguage(), [openId, setOpenId] = useState(null);
  const toggleRead = (message) => list.apply(() => admin.messages.markRead(message.id, !message.isRead), (items, updated) => ImmutableList.replace(items, updated));
  if (list.items === null) return <Loading />;
  if (list.items.length === 0) return <EmptyState>{t('No messages yet.', 'Henüz mesaj yok.')}</EmptyState>;
  const remove = (message) => window.confirm(t('Delete this message?', 'Bu mesaj silinsin mi?')) && actions.remove(message);
  return <div className="space-y-2">{list.items.map((message) => <MessageItem key={message.id} message={message} open={openId === message.id} onToggleOpen={() => setOpenId(openId === message.id ? null : message.id)} onToggleRead={() => toggleRead(message)} onRemove={() => remove(message)} />)}</div>;
}
