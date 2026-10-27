import { Input } from '../value-objects/Input.js';
import { LocalizedText } from '../value-objects/LocalizedText.js';

const DEFAULT_TITLE = 'AnkA Interactive';
const LONG_TEXT = 16_000_000; // MEDIUMTEXT

/** The about section: a title, the studio's story in both languages ({ en, tr }, light markup) and its gallery. */
export class AboutContent
{
  constructor({ title = DEFAULT_TITLE, body = LocalizedText.EMPTY, images = [] } = {})
  {
    Object.assign(this, { title, body, images });
    Object.freeze(this);
  }

  /** Factory for admin input; an empty title falls back to the studio's name. */
  static create(input)
  {
    const title = Input.text(input?.title, 'Title', { required: false }) || DEFAULT_TITLE;
    return new AboutContent({ title, body: Input.localized(input?.body, 'Body', { max: LONG_TEXT, required: false }) });
  }

  withImages(images)
  {
    return new AboutContent({ ...this, images });
  }
}
