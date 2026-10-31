import { STICKY_CTA } from '../../content/restoran.tr';
import { WhatsAppButton } from './ui/WhatsAppButton';

/** Phones only: WhatsApp always within thumb's reach at the bottom of the screen. */
export function StickyWhatsApp()
{
  return <div className="md:hidden fixed inset-x-0 bottom-0 z-30 p-3 bg-cream/95 backdrop-blur border-t border-line"><WhatsAppButton cta="sticky-whatsapp" label={STICKY_CTA} className="w-full shadow-lg" /></div>;
}
