import { useMemo } from 'react';
import { GalleryImage } from '../domain/GalleryImage';
import { mediaUrl } from '../services';

/** The API's images ({ id, url, alt }) as GalleryImages with their thumbnail and full-size addresses. */
export function useGalleryImages(images)
{
  return useMemo(() => GalleryImage.listOf(images, mediaUrl), [images]);
}
