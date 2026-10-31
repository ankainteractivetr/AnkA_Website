import { H2, LEAD, WRAP } from '../../styles';
import { WhatsAppButton } from './WhatsAppButton';

const TONES = Object.freeze({ cream: '', paper: 'bg-paper border-y border-line' });

/** A page section: its title and lead, its content, and — when `cta` is given ({ id, label }) — one WhatsApp button closing it. */
export function Section({ id, title, lead, cta, tone = 'cream', children })
{
  return (
    <section id={id} aria-labelledby={`${id}-baslik`} className={`py-14 sm:py-20 scroll-mt-20 ${TONES[tone]}`}><div className={WRAP}>
      <h2 id={`${id}-baslik`} className={H2}>{title}</h2>{lead && <p className={LEAD}>{lead}</p>}<div className="mt-8 sm:mt-10">{children}</div>
      {cta && <div className="mt-10"><WhatsAppButton cta={`${cta.id}-whatsapp`} label={cta.label} className="w-full sm:w-auto" /></div>}
    </div></section>
  );
}
