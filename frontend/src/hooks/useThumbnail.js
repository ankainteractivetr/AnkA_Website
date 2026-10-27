import { useEffect, useRef } from 'react';
import { ImageLoadWatch } from '../services/images/ImageLoadWatch';
import { useFallbackSource } from './useFallbackSource';

/** Counts the <img> as loading until it settles, and queues the full-size image behind it; returns the cleanup. */
function watchThumbnail(element, tracker, queue, fullUrl)
{
  const watch = new ImageLoadWatch(element);
  tracker.track(watch.promise);
  queue.enqueue(fullUrl);
  return watch.release;
}

/**
 * A gallery image's thumbnail for an eager <img>: it counts as page loading (`tracker`) until it has loaded, and its full-size
 * image is queued on `queue`, which only starts once nothing is loading — so every thumbnail on the page comes first.
 * A missing thumbnail falls back to the full-size image, which is then watched in its place.
 */
export function useThumbnail(image, tracker, queue)
{
  const ref = useRef(null), { src, onError } = useFallbackSource(image.thumbUrl, image.fullUrl);
  useEffect(() => watchThumbnail(ref.current, tracker, queue, image.fullUrl), [src, image.fullUrl, tracker, queue]);
  return { ref, src, onError };
}
