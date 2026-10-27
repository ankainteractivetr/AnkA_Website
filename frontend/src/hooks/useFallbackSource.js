import { useCallback, useState } from 'react';

/**
 * An <img> source that switches to `fallback` when `primary` fails to load — e.g. an image uploaded before thumbnails
 * existed, or a GIF, has no "_thumb" file, so its full-size file is shown instead.
 */
export function useFallbackSource(primary, fallback)
{
  const [failed, setFailed] = useState(false);
  const onError = useCallback(() => setFailed(true), []);
  return { src: failed ? fallback : primary, onError };
}
