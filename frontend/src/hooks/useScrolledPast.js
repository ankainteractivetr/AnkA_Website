import { useSyncExternalStore } from 'react';

function subscribeToScroll(onChange)
{
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}

/** True once the page is scrolled more than `offset` pixels. */
export function useScrolledPast(offset)
{
  return useSyncExternalStore(subscribeToScroll, () => window.scrollY > offset);
}
