/** Copy-on-write helpers for the CMS's list editors (rows are never mutated in place). */
export class ImmutableList
{
  static replace(list, item, matches = (current) => current.id === item.id)
  {
    return list.map((current) => (matches(current) ? item : current));
  }

  static removeById(list, id)
  {
    return list.filter((item) => item.id !== id);
  }

  /** Moves the item at `index` by `delta` places (-1 up, +1 down); out-of-range moves leave the list as is. */
  static move(list, index, delta)
  {
    const target = index + delta;
    if (target < 0 || target >= list.length) return list;
    const copy = [...list];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    return copy;
  }
}
