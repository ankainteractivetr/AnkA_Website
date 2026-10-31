const INPUT = 'mt-2 w-full min-h-12 px-4 rounded-xl border-2 border-line bg-paper text-lg text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none';

/** A labelled number input (no negatives; a numeric keypad on phones), with an optional hint under it. */
export function NumberField({ name, field, value, onChange, max, step = 1 })
{
  const hintId = field.hint ? `${name}-ipucu` : undefined;
  return (
    <div><label htmlFor={name} className="block font-semibold">{field.label}</label>
      <input id={name} type="number" inputMode="decimal" min="0" max={max} step={step} placeholder={field.placeholder} value={value} aria-describedby={hintId} onChange={(event) => onChange(name, event.target.value)} className={INPUT} />
      {hintId && <p id={hintId} className="mt-1.5 text-sm text-muted">{field.hint}</p>}</div>
  );
}
