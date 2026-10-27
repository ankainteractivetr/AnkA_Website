import { useCallback } from 'react';
import { DashboardStats } from '../../domain/DashboardStats';
import { admin } from '../../services';
import { useLoaded } from '../useLoaded';

async function loadStats()
{
  const [projects, messages, feedbacks, highScores] = await Promise.all([admin.projects.list(), admin.messages.list(), admin.feedbacks.list(), admin.highScores.list()]);
  return new DashboardStats({ projects, messages, feedbacks, highScores });
}

/** The dashboard's numbers and latest messages; null while loading. */
export function useDashboard()
{
  const load = useCallback(() => loadStats(), []);
  return useLoaded(load, null);
}
