import { useCallback, useState } from 'react';
import { CircularIndex } from '../domain/CircularIndex';

/** Which image of a gallery (of `count`) the lightbox shows: null while closed; show() wraps around both ends. */
export function useLightbox(count)
{
  const [index, setIndex] = useState(null);
  const close = useCallback(() => setIndex(null), []);
  const show = useCallback((next) => setIndex(CircularIndex.wrap(next, count)), [count]);
  return { index, open: show, close, show };
}
