const EXTENSION = /(\.[^./\\]+)$/;
const THUMBNAIL = /_thumb\.[^./\\]+$/i;

/**
 * Naming convention shared with the frontend (domain/MediaUrl.js): an image's thumbnail sits next to it, with "_thumb"
 * before the same extension — foo.png → foo_thumb.png — so no database field is needed to find it.
 */
export class ThumbnailPath
{
  static SUFFIX = '_thumb';

  static of(filePath)
  {
    return filePath.replace(EXTENSION, `${ThumbnailPath.SUFFIX}$1`);
  }

  static isThumbnail(filePath)
  {
    return THUMBNAIL.test(filePath);
  }
}
