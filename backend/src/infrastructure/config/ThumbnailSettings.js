/** Thumbnail size and quality (THUMB_MAX_PX, THUMB_JPEG_QUALITY), shared by the API and the thumbnail script. */
export class ThumbnailSettings
{
  static from(env)
  {
    return Object.freeze({ maxEdge: Number(env.THUMB_MAX_PX) || 480, jpegQuality: Number(env.THUMB_JPEG_QUALITY) || 82 });
  }
}
