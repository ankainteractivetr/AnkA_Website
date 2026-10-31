/** A page's title and description in one language, and the <meta> tags that carry them to search results and link previews. */
export class PageMeta
{
  constructor({ title, description, locale })
  {
    Object.assign(this, { title, description, locale });
    Object.freeze(this);
  }

  /** Tag key (a meta name or property) → content. */
  tags()
  {
    const { title, description, locale } = this;
    return { description, 'og:title': title, 'og:description': description, 'og:locale': locale, 'twitter:title': title, 'twitter:description': description };
  }
}
