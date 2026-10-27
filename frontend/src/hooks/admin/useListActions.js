import { useMemo } from 'react';
import { ImmutableList } from '../../domain/ImmutableList';

/**
 * The usual edits of a useAdminList list kept by `service` (an AdminCollection, AdminGallery or AdminLog):
 * add, save (replace in place), remove and move (saves the new order). Each is saved at once.
 */
export function useListActions(list, service)
{
  const { apply } = list;
  return useMemo(() => ({
    add: (saveNew) => apply(saveNew, (items, created) => [...items, created]),
    save: (entry) => apply(() => service.save(entry), (items, saved) => ImmutableList.replace(items, saved)),
    remove: (entry) => apply(() => service.remove(entry.id), (items) => ImmutableList.removeById(items, entry.id)),
    move: (items, index, delta) => apply(() => service.reorder(ImmutableList.move(items, index, delta).map((item) => item.id)), (_items, reordered) => reordered),
  }), [apply, service]);
}
