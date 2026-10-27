import { useFallbackSource } from '../../../hooks/useFallbackSource';
import { mediaUrl } from '../../../services';

/** An uploaded image's thumbnail in CMS lists, falling back to the full-size file when it has no thumbnail. */
export function AdminThumb({ url, alt = '', className })
{
  const { src, onError } = useFallbackSource(mediaUrl.thumbnail(url), mediaUrl.resolve(url));
  return <img src={src} alt={alt} loading="lazy" decoding="async" onError={onError} className={className} />;
}
