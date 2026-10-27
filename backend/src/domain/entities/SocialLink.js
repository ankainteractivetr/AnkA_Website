import { Input } from '../value-objects/Input.js';

/** A social media link of the footer; `iconName` picks its icon (defaults to the platform's name in lower case). */
export class SocialLink
{
  constructor({ id = null, platform, url, iconName, displayOrder = 0, isActive = true })
  {
    Object.assign(this, { id, platform, url, iconName, displayOrder, isActive });
    Object.freeze(this);
  }

  /** Factory for admin input: validates every field. */
  static create(input, id = null)
  {
    const link = input ?? {};
    const platform = Input.text(link.platform, 'Platform', { max: 50 });
    const iconName = Input.text(link.iconName, 'Icon', { max: 50, required: false }) || platform.toLowerCase();
    return new SocialLink({ id, platform, url: Input.url(link.url, 'URL'), iconName, isActive: Input.boolean(link.isActive ?? true) });
  }

  withId(id)
  {
    return new SocialLink({ ...this, id });
  }

  /** Display position; set by the use case (end of the list, or kept), never by the admin form. */
  withDisplayOrder(displayOrder)
  {
    return new SocialLink({ ...this, displayOrder });
  }
}
