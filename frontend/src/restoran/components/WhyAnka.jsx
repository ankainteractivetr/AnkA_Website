import { WHY } from '../../content/restoran.tr';
import { Icon } from './ui/Icon';
import { Section } from './ui/Section';

// The content names an icon by what it means; this page draws it with one of its own.
const ICONS = Object.freeze({ code: 'code', shield: 'shield', chat: 'chat', key: 'lock', pin: 'pin' });

function Reason({ reason })
{
  return <li className="flex gap-4"><span className="shrink-0 grid place-items-center w-12 h-12 rounded-xl bg-accent-soft text-accent"><Icon name={ICONS[reason.icon]} /></span><div><h3 className="text-xl font-bold">{reason.title}</h3><p className="mt-1 text-lg text-muted">{reason.text}</p></div></li>;
}

/** Why a small studio: we write the software, you talk to the developer, the domain and the data stay yours. */
export function WhyAnka()
{
  return <Section id="neden-anka" title={WHY.title}><ul className="grid md:grid-cols-2 gap-8">{WHY.items.map((reason) => <Reason key={reason.title} reason={reason} />)}</ul></Section>;
}
