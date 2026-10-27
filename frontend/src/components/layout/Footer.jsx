import { useResource } from '../../hooks/useResource';
import { useLanguage } from '../../i18n/useLanguage';
import { contactInfoService } from '../../services';
import { SocialIcon } from '../ui/SocialIcon';

const THIS_YEAR = new Date().getFullYear();
const SOCIAL_LINK = 'w-11 h-11 flex items-center justify-center bg-ink-700/80 border border-ink-400 rounded-xs text-ash transition-all duration-300 hover:text-phoenix hover:border-phoenix hover:shadow-glow-phoenix';

function SocialLinks({ links })
{
  return <div className="flex justify-center gap-3">{links.map((link) => <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform} title={link.platform} className={SOCIAL_LINK}><SocialIcon name={link.iconName} /></a>)}</div>;
}

function MadeInTurkiye()
{
  const { t } = useLanguage(), label = t('Made in Türkiye', "Türkiye'de Üretildi");
  return <div className="flex justify-center sm:justify-end"><a href="https://en.wikipedia.org/wiki/Turkey" target="_blank" rel="noopener noreferrer" title={label}><img src="/MADE-IN-TURKIYE.png" alt={label} className="h-14 opacity-80 hover:opacity-100 transition-opacity" /></a></div>;
}

export function Footer()
{
  const info = useResource(contactInfoService, null);
  return (
    <footer className="relative bg-ink-900/80 border-t border-ink-400/60"><div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 grid sm:grid-cols-3 items-center gap-6">
      <div className="text-center sm:text-left"><p className="font-deco text-2xl text-parchment leading-snug">AnkA Interactive</p><p className="font-heading text-ember tracking-widest text-sm">© 2023 — {THIS_YEAR}</p></div>
      <SocialLinks links={info?.socialLinks ?? []} /><MadeInTurkiye />
    </div></footer>
  );
}
