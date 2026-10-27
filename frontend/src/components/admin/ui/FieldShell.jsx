import { HINT, LABEL } from './styles';

/** Label above a form control (linked by `id`) and an optional hint below it. */
export function FieldShell({ id, label, hint, className = '', children })
{
  return <div className={`min-w-0 ${className}`}><label className={LABEL} htmlFor={id}>{label}</label>{children}{hint && <span className={HINT}>{hint}</span>}</div>;
}
