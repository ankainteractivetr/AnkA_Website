import { useEffect } from 'react';

/** Keeps the page's title and description tags (search results, link previews) on `meta`, a PageMeta, via `head` (a DocumentHead). */
export function useDocumentMeta(head, meta)
{
  useEffect(() => {
    head.show(meta);
  }, [head, meta]);
}
