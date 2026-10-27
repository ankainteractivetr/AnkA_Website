import { Input } from '../value-objects/Input.js';
import { ProjectLinks } from '../value-objects/ProjectLinks.js';

const TEXT = 65_000; // TEXT
const LONG_TEXT = 16_000_000; // MEDIUMTEXT

/**
 * A game or software title on the website. tagline/description/features/status are LocalizedText (description and
 * features use the light markup), links a ProjectLinks, images its screenshots.
 */
export class Project
{
  static TYPES = Object.freeze(['game', 'software']);

  constructor({ id = null, slug, type, title, tagline, description, features, status, links, displayOrder = 0, isPublished = true, images = [] })
  {
    Object.assign(this, { id, slug, type, title, tagline, description, features, status, links, displayOrder, isPublished, images });
    Object.freeze(this);
  }

  /** Factory for admin input: validates every field. */
  static create(input = {}, id = null)
  {
    return new Project({
      id, slug: Input.slug(input.slug, 'Slug'), type: Input.oneOf(input.type, Project.TYPES, 'Type'), title: Input.text(input.title, 'Title'),
      tagline: Input.localized(input.tagline, 'Tagline', { max: TEXT, required: false }), status: Input.localized(input.status, 'Status', { required: false }),
      description: Input.localized(input.description, 'Description', { max: LONG_TEXT, required: false }), features: Input.localized(input.features, 'Features', { max: LONG_TEXT, required: false }),
      links: ProjectLinks.create(input.links), displayOrder: Input.integer(input.displayOrder ?? 0, 'Display order'), isPublished: Input.boolean(input.isPublished ?? true),
    });
  }

  withId(id)
  {
    return new Project({ ...this, id });
  }

  withImages(images)
  {
    return new Project({ ...this, images });
  }
}
