const EXTERNAL = /^https?:\/\//i;
const EXTENSION = /(\.[^./?#]+)([?#].*)?$/;
const THUMBNAIL_SUFFIX = '_thumb';

/**
 * Resolves the image addresses the API stores (/uploads/…) against the backend's address, and derives their thumbnails
 * with the backend's naming convention (ThumbnailPath.js): /uploads/a.png → /uploads/a_thumb.png.
 */
export class MediaUrl
{
  #backendUrl;

  constructor(backendUrl = '')
  {
    this.#backendUrl = backendUrl.replace(/\/+$/, '');
  }

  resolve(url)
  {
    if (!url || EXTERNAL.test(url)) return url ?? '';
    return url.startsWith('/uploads/') ? `${this.#backendUrl}${url}` : url;
  }

  /** The thumbnail of an uploaded image; an external image has none, so it is returned as is. */
  thumbnail(url)
  {
    if (!url || EXTERNAL.test(url)) return url ?? '';
    return this.resolve(url.replace(EXTENSION, `${THUMBNAIL_SUFFIX}$1$2`));
  }
}
