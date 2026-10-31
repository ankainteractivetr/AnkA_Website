import { REFERENCE } from '../../content/restoran.tr';
import { CARD, LINK } from '../styles';
import { Icon } from './ui/Icon';
import { Section } from './ui/Section';

function Screenshots({ images })
{
  if (images.length === 0) return null;
  return <div className="mt-6 flex gap-4 overflow-x-auto">{images.map((image) => <img key={image.src} src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" className="h-96 w-auto rounded-xl border border-line" />)}</div>;
}

/** The live proof: De Pizzazz — what we built, a link to it and (with the owner's permission) screenshots. */
export function Reference()
{
  const { title, name, place, text, link, screenshots } = REFERENCE;
  return (
    <Section id="referans" title={title} tone="paper"><div className={`${CARD} bg-cream!`}>
      <h3 className="text-2xl font-bold">{name} <span className="font-normal text-muted">· {place}</span></h3><p className="mt-3 text-lg">{text}</p>
      <a href={link.url} target="_blank" rel="noopener noreferrer" data-cta="reference-site" className={`mt-4 inline-flex items-center gap-2 min-h-11 ${LINK}`}>{link.label}<Icon name="external" size={18} /></a><Screenshots images={screenshots} />
    </div></Section>
  );
}
