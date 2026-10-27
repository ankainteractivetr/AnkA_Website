import { useThumbnail } from '../../../hooks/useThumbnail';
import { fullImageQueue, pageLoading } from '../../../services';

/**
 * A gallery thumbnail on the public site. It loads eagerly, together with every other thumbnail on the page;
 * its full-size image follows in the background once they all have (see BackgroundImageQueue).
 */
export function GalleryThumb({ image, className })
{
  const { ref, src, onError } = useThumbnail(image, pageLoading, fullImageQueue);
  return <img ref={ref} src={src} alt={image.alt} decoding="async" onError={onError} className={className} />;
}
