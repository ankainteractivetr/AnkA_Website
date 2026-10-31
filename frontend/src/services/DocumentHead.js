/** Adapter over the page's <head>: its title and the content of the <meta> tags that index.html declares. */
export class DocumentHead
{
  #document;

  constructor(document)
  {
    this.#document = document;
  }

  /** Shows a PageMeta: the title, and each of its tags that the page has (an unknown tag is skipped, never added). */
  show(meta)
  {
    this.#document.title = meta.title;
    for (const [key, content] of Object.entries(meta.tags())) this.#tag(key)?.setAttribute('content', content);
  }

  #tag(key)
  {
    return this.#document.head.querySelector(`meta[name="${key}"], meta[property="${key}"]`);
  }
}
