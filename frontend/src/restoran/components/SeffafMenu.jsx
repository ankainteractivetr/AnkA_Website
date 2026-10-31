import { SEFFAF_MENU } from '../../content/restoran.tr';
import { CARD, LINK } from '../styles';
import { CheckList } from './ui/CheckList';
import { Icon } from './ui/Icon';
import { Section } from './ui/Section';

function Deadlines()
{
  const { deadlines } = SEFFAF_MENU;
  return (
    <div className="mt-6 rounded-2xl bg-accent-soft p-5"><p className="flex items-center gap-2 font-semibold"><Icon name="calendar" size={20} className="text-accent" />{deadlines.title}</p>
      <dl className="mt-3 space-y-2">{deadlines.items.map((item) => <div key={item.label} className="flex flex-wrap justify-between gap-x-4"><dt>{item.label}</dt><dd className="font-bold">{item.date}</dd></div>)}</dl>
      <a href={deadlines.source.url} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-block ${LINK}`}>{deadlines.source.label}</a></div>
  );
}

/** The door-opener: menus must now show ingredients, allergens and calories, and what we do about it. */
export function SeffafMenu()
{
  const { title, text, doTitle, does, note, cta } = SEFFAF_MENU;
  return (
    <Section id="seffaf-menu" title={title} tone="paper" cta={{ id: 'seffaf', label: cta }}><div className="grid md:grid-cols-2 gap-8 md:gap-12">
      <div className="space-y-4 text-lg text-muted">{text.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<Deadlines /></div>
      <div className={`${CARD} bg-cream!`}><h3 className="text-xl font-bold">{doTitle}</h3><CheckList items={does} className="mt-4 text-lg" /><p className="mt-6 text-sm text-muted">{note}</p></div>
    </div></Section>
  );
}
