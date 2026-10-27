import { useId } from 'react';
import { FieldShell } from './FieldShell';
import { INPUT } from './styles';

/** Labelled text input or textarea (multiline); onChange receives the new string; `mono` suits markup and addresses. */
export function TextField({ label, value, onChange, multiline = false, rows = 3, hint, mono = false, className = '', type = 'text', ...rest })
{
  const id = useId(), Control = multiline ? 'textarea' : 'input';
  const controlClass = `${INPUT} ${mono ? 'font-mono text-sm leading-relaxed' : ''}`;
  return (
    <FieldShell id={id} label={label} hint={hint} className={className}>
      <Control id={id} className={controlClass} type={multiline ? undefined : type} rows={multiline ? rows : undefined} value={value ?? ''} onChange={(event) => onChange(event.target.value)} {...rest} />
    </FieldShell>
  );
}
