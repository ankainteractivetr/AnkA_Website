import { CONTACT } from '../../../content/restoran.tr';
import { WhatsAppLink } from '../../../domain/WhatsAppLink';
import { buttonClass } from '../../styles';
import { Icon } from './Icon';

const HREF = String(new WhatsAppLink(CONTACT.whatsapp, CONTACT.whatsappMessage));

/** Opens a WhatsApp chat with the ready-typed message; `cta` names the button for later measurement (data-cta="hero-whatsapp"). */
export function WhatsAppButton({ cta, label, variant = 'primary', className = '' })
{
  return <a href={HREF} target="_blank" rel="noopener noreferrer" data-cta={cta} className={buttonClass(variant, className)}><Icon name="chat" size={22} />{label}</a>;
}
