const RECENT_MESSAGES = 5;

/** The CMS dashboard's numbers, counted from the lists the API returns. */
export class DashboardStats
{
  static EMPTY = new DashboardStats({ projects: [], messages: [], feedbacks: [], highScores: [] });

  constructor({ projects, messages, feedbacks, highScores })
  {
    this.projects = projects.length;
    this.games = projects.filter((project) => project.type === 'game').length;
    this.software = this.projects - this.games;
    Object.assign(this, { messages: messages.length, unread: messages.filter((message) => !message.isRead).length });
    Object.assign(this, { feedbacks: feedbacks.length, highScores: highScores.length, recentMessages: messages.slice(0, RECENT_MESSAGES) });
    Object.freeze(this);
  }
}
