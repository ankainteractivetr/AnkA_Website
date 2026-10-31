import { STEPS } from '../../content/restoran.tr';
import { Section } from './ui/Section';

function Step({ step, number })
{
  return <li className="flex gap-4"><span className="shrink-0 grid place-items-center w-11 h-11 rounded-full bg-accent text-white text-lg font-bold" aria-hidden="true">{number}</span><div><h3 className="text-xl font-bold">{step.title}</h3><p className="mt-1 text-lg text-muted">{step.text}</p></div></li>;
}

/** How we work, in four numbered steps. */
export function Steps()
{
  return (
    <Section id="nasil-calisiyoruz" title={STEPS.title} cta={{ id: 'steps', label: STEPS.cta }}>
      <ol className="grid md:grid-cols-2 gap-8">{STEPS.items.map((step, index) => <Step key={step.title} step={step} number={index + 1} />)}</ol>
    </Section>
  );
}
