/** An uploaded image as the site shows it: its small thumbnail in grids, the full-size file in the lightbox. */
export class GalleryImage
{
  constructor({ id, alt, thumbUrl, fullUrl })
  {
    Object.assign(this, { id, alt, thumbUrl, fullUrl });
    Object.freeze(this);
  }

  /** From the API's { id, url, alt }. */
  static from(image, mediaUrl)
  {
    return new GalleryImage({ id: image.id, alt: image.alt ?? '', thumbUrl: mediaUrl.thumbnail(image.url), fullUrl: mediaUrl.resolve(image.url) });
  }

  static listOf(images, mediaUrl)
  {
    return (images ?? []).map((image) => GalleryImage.from(image, mediaUrl));
  }
}
