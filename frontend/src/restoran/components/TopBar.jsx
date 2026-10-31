import { CONTACT, TOP_BAR } from '../../content/restoran.tr';
import { WRAP } from '../styles';
import { Icon } from './ui/Icon';
import { WhatsAppButton } from './ui/WhatsAppButton';

const PHONE = 'inline-flex items-center gap-2 min-h-11 px-2 font-semibold text-ink hover:text-accent';

function Brand()
{
  return <a href="/" aria-label={TOP_BAR.homeLabel} className="flex items-center gap-2 min-h-11"><img src="/AnkA-Interactive-Logo-80.png" alt="" width="40" height="40" className="w-10 h-10" /><span className="hidden min-[400px]:block font-bold tracking-tight">AnkA Interactive</span></a>;
}

/** The bar over the page: the logo back to the home page, the phone number and WhatsApp. */
export function TopBar()
{
  return (
    <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur border-b border-line"><div className={`${WRAP} h-16 flex items-center justify-between gap-3`}>
      <Brand /><div className="flex items-center gap-1 sm:gap-3"><a href={CONTACT.phoneHref} data-cta="topbar-phone" className={PHONE}><Icon name="phone" size={20} /><span className="hidden sm:inline">{CONTACT.phoneLabel}</span><span className="sr-only sm:hidden">Telefonla arayın</span></a>
        <WhatsAppButton cta="topbar-whatsapp" label={TOP_BAR.whatsapp} className="min-h-11! px-4! py-2! text-base!" /></div>
    </div></header>
  );
}
