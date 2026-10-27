import { useState } from 'react';
import { FeedbacksPanel } from '../../components/admin/submissions/FeedbacksPanel';
import { MessagesPanel } from '../../components/admin/submissions/MessagesPanel';
import { ScoresPanel } from '../../components/admin/submissions/ScoresPanel';
import { SubmissionTabs } from '../../components/admin/submissions/SubmissionTabs';
import { AdminPage } from '../../components/admin/ui/AdminPage';
import { ErrorNotice } from '../../components/admin/ui/Notice';
import { useSubmissions } from '../../hooks/admin/useSubmissions';
import { useLanguage } from '../../i18n/useLanguage';

const PANELS = Object.freeze({ messages: MessagesPanel, feedbacks: FeedbacksPanel, scores: ScoresPanel });

/** What visitors and games sent: contact messages, in-game feedback and high scores, one tab each. */
export function SubmissionsPage()
{
  const { t } = useLanguage(), [tab, setTab] = useState('messages'), submissions = useSubmissions();
  const Panel = PANELS[tab], { list, actions } = submissions[tab];
  return (
    <AdminPage eyebrow={t('Inbox', 'Gelen Kutusu')} title={t('Submissions', 'Gönderiler')}>
      <SubmissionTabs tab={tab} onChange={setTab} submissions={submissions} /><ErrorNotice error={list.error} /><Panel list={list} actions={actions} />
    </AdminPage>
  );
}
