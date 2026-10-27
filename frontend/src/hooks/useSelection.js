import { useState } from 'react';

/**
 * The chosen entry of `items` (anything with an id) and select(id) to choose another. Until one is chosen, or when the
 * chosen one is no longer in the list, the first entry is; null for an empty list.
 */
export function useSelection(items)
{
  const [selectedId, select] = useState(null);
  const selected = items.find((item) => item.id === selectedId) ?? items[0] ?? null;
  return [selected, select];
}
