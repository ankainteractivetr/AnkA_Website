import { Icon } from './Icon';

/** A list of short sentences, each after an accent tick. */
export function CheckList({ items, className = '' })
{
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => <li key={item} className="flex gap-3"><Icon name="check" size={22} className="shrink-0 mt-0.5 text-accent" /><span>{item}</span></li>)}
    </ul>
  );
}
