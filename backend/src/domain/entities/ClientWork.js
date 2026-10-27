import { Input } from '../value-objects/Input.js';
import { WorkMedia } from '../value-objects/WorkMedia.js';

/** A work AnkA has done for a client, listed in the site's Services section; `media` (WorkMedia) is what its frame shows. */
export class ClientWork
{
  constructor({ id = null, title, media, displayOrder = 0, isPublished = true })
  {
    Object.assign(this, { id, title, media, displayOrder, isPublished });
    Object.freeze(this);
  }

  /** Factory for admin input: validates every field. */
  static create(input, id = null)
  {
    const work = input ?? {};
    return new ClientWork({ id, title: Input.text(work.title, 'Title'), media: WorkMedia.create(work.media), isPublished: Input.boolean(work.isPublished ?? true) });
  }

  withId(id)
  {
    return new ClientWork({ ...this, id });
  }

  /** Display position; set by the use case (end of the list, or kept), never by the admin form. */
  withDisplayOrder(displayOrder)
  {
    return new ClientWork({ ...this, displayOrder });
  }
}
