import { CONTACT, FOOTER } from '../../content/restoran.tr';
import { WRAP } from '../styles';

const ITEM = 'inline-flex items-center min-h-11 hover:text-accent';
const THIS_YEAR = new Date().getFullYear();

/** Who we are and how to reach us, and the way back to the main site. Extra room at the bottom on phones for the sticky WhatsApp button. */
export function Footer()
{
  return (
    <footer className="border-t border-line pb-24 md:pb-0"><div className={`${WRAP} py-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-6 gap-y-1 text-muted`}>
      <p className="min-h-11 inline-flex items-center font-semibold text-ink">© {THIS_YEAR} {FOOTER.name} · {FOOTER.city}</p><a href={`mailto:${CONTACT.email}`} data-cta="footer-email" className={ITEM}>{CONTACT.email}</a>
      <a href={CONTACT.phoneHref} data-cta="footer-phone" className={ITEM}>{CONTACT.phoneLabel}</a><a href="/" className={ITEM}>{FOOTER.home}</a>
    </div></footer>
  );
}
