import { Input } from '../value-objects/Input.js';
import { LocalizedText } from '../value-objects/LocalizedText.js';

const TEXT = 65_000;

/** The contact section's texts ({ en, tr }), public e-mail and Google Maps embed address, plus the footer's social links. */
export class ContactInfo
{
  constructor({ intro = LocalizedText.EMPTY, outro = LocalizedText.EMPTY, email = null, mapEmbedUrl = null, socialLinks = [] } = {})
  {
    Object.assign(this, { intro, outro, email, mapEmbedUrl, socialLinks });
    Object.freeze(this);
  }

  /** Factory for admin input: validates every field. */
  static create(input)
  {
    const info = input ?? {};
    return new ContactInfo({
      intro: Input.localized(info.intro, 'Intro', { max: TEXT, required: false }), outro: Input.localized(info.outro, 'Outro', { max: TEXT, required: false }),
      email: Input.email(info.email, 'Public e-mail'), mapEmbedUrl: Input.link(info.mapEmbedUrl, 'Google Maps embed URL', { max: 1000 }),
    });
  }

  withSocialLinks(socialLinks)
  {
    return new ContactInfo({ ...this, socialLinks });
  }
}
