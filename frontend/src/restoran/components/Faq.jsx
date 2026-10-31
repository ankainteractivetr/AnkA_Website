import { FAQ } from '../../content/restoran.tr';
import { Icon } from './ui/Icon';
import { Section } from './ui/Section';

function Question({ item })
{
  return (
    <details className="group border-b border-line">
      <summary className="flex items-center justify-between gap-4 min-h-14 py-4 text-lg font-semibold list-none">{item.q}<Icon name="chevron" className="shrink-0 text-accent motion-safe:transition-transform group-open:rotate-180" /></summary><p className="pb-5 text-lg text-muted">{item.a}</p>
    </details>
  );
}

/** Frequently asked questions, each opening in place (no JavaScript needed). */
export function Faq()
{
  return <Section id="sss" title={FAQ.title} tone="paper" cta={{ id: 'faq', label: FAQ.cta }}><div className="max-w-3xl border-t border-line">{FAQ.items.map((item) => <Question key={item.q} item={item} />)}</div></Section>;
}
