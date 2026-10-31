import { HERO } from '../../../content/restoran.tr';
import { buttonClass, LINK, WRAP } from '../../styles';
import { WhatsAppButton } from '../ui/WhatsAppButton';
import { PhoneMock } from './PhoneMock';

function TrustLine()
{
  const { trust } = HERO;
  return <p className="mt-6 text-muted">{trust.label} <a href={trust.url} target="_blank" rel="noopener noreferrer" data-cta="hero-reference" className={LINK}>{trust.name}</a></p>;
}

/** The first screen: the page's one h1, what we do in a sentence, WhatsApp and the packages. */
export function Hero()
{
  return (
    <section className={`${WRAP} pt-10 pb-14 sm:pt-16 sm:pb-20 grid md:grid-cols-[1fr_auto] items-center gap-10 md:gap-14`}>
      <div><h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-balance">{HERO.title}</h1><p className="mt-5 text-lg sm:text-xl text-muted max-w-xl">{HERO.text}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3"><WhatsAppButton cta="hero-whatsapp" label={HERO.primary} /><a href="#paketler" data-cta="hero-packages" className={buttonClass('secondary')}>{HERO.secondary}</a></div><TrustLine /></div>
      <PhoneMock />
    </section>
  );
}
