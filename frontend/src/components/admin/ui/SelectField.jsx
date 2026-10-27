import { useId } from 'react';
import { FieldShell } from './FieldShell';
import { INPUT } from './styles';

/** Labelled select; options are { value, label }; onChange receives the selected value. */
export function SelectField({ label, value, onChange, options, className = '' })
{
  const id = useId();
  return (
    <FieldShell id={id} label={label} className={className}>
      <select id={id} className={INPUT} value={value ?? ''} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
    </FieldShell>
  );
}
