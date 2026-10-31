import { PACKAGES } from '../../../content/restoran.tr';
import { CARD } from '../../styles';
import { CheckList } from '../ui/CheckList';
import { Section } from '../ui/Section';
import { PackageCard } from './PackageCard';

/** Services added to any package (social media, Maps reviews …), under the cards. */
function Extras({ extras })
{
  return <div className={`${CARD} mt-8 bg-cream!`}><h3 className="text-xl font-bold">{extras.title}</h3><p className="mt-1 text-muted">{extras.text}</p><CheckList items={extras.items} className="mt-4 text-lg" /></div>;
}

/** The packages, one under another on phones and in three columns on wide screens, then the extras. */
export function Packages()
{
  return (
    <Section id="paketler" title={PACKAGES.title} lead={PACKAGES.text} tone="paper" cta={{ id: 'packages', label: PACKAGES.cta }}>
      <div className="grid md:grid-cols-3 items-start gap-8 md:gap-5 lg:gap-6">{PACKAGES.items.map((item) => <PackageCard key={item.id} item={item} />)}</div>
      <p className="mt-8 text-muted max-w-3xl">{PACKAGES.note}</p><Extras extras={PACKAGES.extras} />
    </Section>
  );
}
