import { useCallback, useEffect, useState } from 'react';

const LOADING = Object.freeze({ items: null, busy: false, error: null });

/** Loads the list once; an answer arriving after unmount (or a newer load) is ignored. */
function loadList(load, setState)
{
  let current = true;
  load().then((items) => current && setState({ items, busy: false, error: null }), (error) => current && setState({ items: [], busy: false, error }));
  return () => { current = false; };
}

/** Runs `change()` (a save, delete or reorder request); on success `update(items, result)` gives the new list. */
async function applyChange(setState, change, update)
{
  setState((state) => ({ ...state, busy: true, error: null }));
  const settled = await change().then((result) => ({ result }), (error) => ({ error }));
  setState((state) => (settled.error ? { ...state, busy: false, error: settled.error } : { items: update(state.items, settled.result), busy: false, error: null }));
  return !settled.error;
}

/**
 * A CMS list (items is null while loading) loaded with `load()` (a stable callback). apply(change, update) saves one edit
 * right away — e.g. a delete or a new order — and applies its result to the list; a failure keeps the list and sets error.
 * apply resolves to whether the change was saved.
 */
export function useAdminList(load)
{
  const [state, setState] = useState(LOADING);
  useEffect(() => loadList(load, setState), [load]);
  const apply = useCallback((change, update) => applyChange(setState, change, update), []);
  return { ...state, apply };
}
