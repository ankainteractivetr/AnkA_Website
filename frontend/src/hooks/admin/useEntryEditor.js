import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useEditor } from './useEditor';

/** The entry with this route id as a form, or an empty form for "new". */
async function loadForm(id, { collection, form, notFound })
{
  if (id === 'new') return form.empty();
  const entry = (await collection.list()).find((item) => String(item.id) === id);
  if (!entry) throw new Error(notFound);
  return form.from(entry);
}

/** A new entry moves to its own address once created, where the rest of its page (screenshots, preview) appears. */
async function saveForm(value, { collection, form, path }, navigate)
{
  const saved = await collection.save(form.toPayload(value));
  if (!value.id) navigate(`${path}/${saved.id}`, { replace: true });
  return form.from(saved);
}

/**
 * useEditor for one entry of an AdminCollection edited on its own page (`${path}/:id`; id "new" is an empty form).
 * `entry` is a stable { collection, form, path, notFound }: `form` maps between the API and the form (empty / from / toPayload).
 */
export function useEntryEditor(id, entry)
{
  const navigate = useNavigate();
  const load = useCallback(() => loadForm(id, entry), [id, entry]);
  const save = useCallback((value) => saveForm(value, entry, navigate), [entry, navigate]);
  return useEditor(load, save);
}
