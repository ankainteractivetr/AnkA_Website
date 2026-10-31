import { CheckList } from '../ui/CheckList';

const CARD = 'relative flex flex-col rounded-2xl bg-paper p-6 sm:p-7';
const FEATURED = 'border-2 border-accent shadow-lg md:-my-3 md:py-10';

function Badge({ text })
{
  return <span className="absolute -top-3.5 left-6 rounded-full bg-accent px-3 py-1 text-sm font-bold text-white">{text}</span>;
}

/** The monthly price, large, with its period and what setup costs under it. */
function Price({ price })
{
  return <div className="mt-6 pt-5 border-t border-line"><p><span className="text-4xl font-extrabold tracking-tight">{price.amount}</span> <span className="text-muted">{price.period}</span></p><p className="mt-1 font-semibold text-accent">{price.setup}</p></div>;
}

/** One package from PACKAGES.items: name, one line on who it is for, what it includes and its price; a `badge` makes it stand out. */
export function PackageCard({ item })
{
  return (
    <article className={`${CARD} ${item.badge ? FEATURED : 'border border-line'}`}>{item.badge && <Badge text={item.badge} />}
      <h3 className="text-2xl font-bold">{item.name}</h3><p className="mt-2 text-muted">{item.tagline}</p><CheckList items={item.features} className="mt-6 flex-1" />
      <Price price={item.price} />{item.footnote && <p className="mt-3 text-sm text-muted">{item.footnote}</p>}
    </article>
  );
}
