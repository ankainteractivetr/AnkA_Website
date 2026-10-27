import { ErrorNotice, Loading } from './Notice';

/** Shows a loading or load-error message until the editor has a value, then renders `children(value)`. */
export function EditorGate({ editor, children })
{
  if (editor.value !== null) return children(editor.value);
  return editor.status === 'error' ? <ErrorNotice error={editor.error} /> : <Loading />;
}
