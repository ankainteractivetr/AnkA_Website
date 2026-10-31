import { HERO } from '../../../content/restoran.tr';
import { Icon } from '../ui/Icon';

function MenuItem({ item })
{
  return (
    <li className="py-3 border-b border-line last:border-b-0">
      <div className="flex justify-between gap-2 font-semibold"><span>{item.name}</span><span>{item.price}</span></div><p className="mt-0.5 text-xs text-muted">{item.info}</p>
    </li>
  );
}

/** A drawn phone showing a sample QR menu (names, prices, allergens, calories) — the product itself instead of a stock photo. */
export function PhoneMock()
{
  const { demo } = HERO;
  return (
    <div role="img" aria-label={demo.label} className="mx-auto w-64 sm:w-72 rounded-[2.5rem] border-[10px] border-ink bg-paper shadow-xl"><div className="px-4 pt-5 pb-6 text-sm">
      <div className="flex items-center justify-between"><span className="font-bold text-base">{demo.venue}</span><Icon name="qr" size={20} className="text-accent" /></div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent">{demo.category}</p><ul className="mt-1">{demo.items.map((item) => <MenuItem key={item.name} item={item} />)}</ul>
    </div></div>
  );
}
