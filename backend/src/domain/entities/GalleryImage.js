import { Input } from '../value-objects/Input.js';

/** An image of a gallery (the about section's, or a project's screenshots); `url` is its /uploads/… address. */
export class GalleryImage
{
  constructor({ id = null, url = null, alt = '', displayOrder = 0 })
  {
    Object.assign(this, { id, url, alt, displayOrder });
    Object.freeze(this);
  }

  /** Factory for admin input; the url is set once the file is stored. */
  static create({ alt })
  {
    return new GalleryImage({ alt: Input.text(alt, 'Alt text', { required: false }) });
  }

  withUrl(url)
  {
    return new GalleryImage({ ...this, url });
  }

  withId(id)
  {
    return new GalleryImage({ ...this, id });
  }

  withDisplayOrder(displayOrder)
  {
    return new GalleryImage({ ...this, displayOrder });
  }
}
