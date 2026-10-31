import { useLanguage } from '../../../i18n/useLanguage';
import { Icon } from '../../ui/Icon';
import { buttonClass, PANEL } from '../../ui/styles';
import { SERVICE_OFFERS } from './serviceOffers';

// The featured offer takes the whole first row, with an ember glow; the others share the row under it.
const FEATURED = 'md:col-span-3 md:flex md:items-center md:justify-between md:gap-10 border-ember/50! shadow-glow-ember';

function ServiceCard({ offer })
{
  const { pick } = useLanguage();
  return (
    <article className={`${PANEL} p-6 sm:p-8 ${offer.featured ? FEATURED : ''}`}><div className="relative">
      <Icon name={offer.icon} size={offer.featured ? 36 : 28} className="text-phoenix" /><h3 className={`mt-4 font-heading tracking-wider text-parchment ${offer.featured ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>{pick(offer.title)}</h3><p className="mt-2 text-parchment/75 max-w-2xl">{pick(offer.text)}</p>
    </div>{offer.link && <a href={offer.link.href} className={buttonClass('primary', 'relative mt-6 md:mt-0 shrink-0')}>{pick(offer.link.label)}<Icon name="next" size={18} /></a>}</article>
  );
}

/** What AnkA does for businesses, as cards: restaurants first and largest, then web, desktop and games. */
export function ServiceCards()
{
  return <div className="grid md:grid-cols-3 gap-5 animate-fade-up">{SERVICE_OFFERS.map((offer) => <ServiceCard key={offer.id} offer={offer} />)}</div>;
}
