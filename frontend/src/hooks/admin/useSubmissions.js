import { admin } from '../../services';
import { useAdminList } from './useAdminList';
import { useListActions } from './useListActions';

const loadMessages = () => admin.messages.list();
const loadFeedbacks = () => admin.feedbacks.list();
const loadScores = () => admin.highScores.list();

/** The submissions page's three lists, each as { list, actions } (see useAdminList and useListActions). */
export function useSubmissions()
{
  const messages = useAdminList(loadMessages), feedbacks = useAdminList(loadFeedbacks), scores = useAdminList(loadScores);
  const messageActions = useListActions(messages, admin.messages), feedbackActions = useListActions(feedbacks, admin.feedbacks), scoreActions = useListActions(scores, admin.highScores);
  return { messages: { list: messages, actions: messageActions }, feedbacks: { list: feedbacks, actions: feedbackActions }, scores: { list: scores, actions: scoreActions } };
}
