import { useEffect } from 'react';

function hashTarget(hash)
{
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return hash.slice(1);
  }
}

/** Waits until nothing is loading and the browser is idle (the sections have rendered), then scrolls to element `id`. */
function scrollWhenLoaded(id, tracker, scheduler)
{
  let cancelScroll = () => {};
  const cancelWait = tracker.onceIdle(() => { cancelScroll = scheduler.schedule(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })); });
  return () => { cancelWait(); cancelScroll(); };
}

/**
 * Arriving with a #hash (e.g. /#shahmaran): the target is a section or project card that only exists once its data has
 * loaded, so scrolling waits for the page to finish loading. Call it in the page component: React runs the sections'
 * effects first, so their requests are already tracked when this one runs.
 */
export function useHashScroll(tracker, scheduler)
{
  useEffect(() => {
    const id = hashTarget(window.location.hash);
    return id ? scrollWhenLoaded(id, tracker, scheduler) : undefined;
  }, [tracker, scheduler]);
}
