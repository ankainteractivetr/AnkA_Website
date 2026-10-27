import { useLanguage } from '../../i18n/useLanguage';
import { buttonClass, TEXT_GRADIENT_PHOENIX } from '../ui/styles';

const DECOR = 'absolute pointer-events-none';
const EMBER_GLOW = `${DECOR} inset-0 opacity-90 bg-[radial-gradient(circle_at_30%_20%,rgb(192_45_0/0.18),transparent_50%),radial-gradient(circle_at_80%_80%,rgb(245_165_36/0.1),transparent_50%)]`;
// One class per string literal: Tailwind finds classes by scanning the source, so a class cannot be split across literals.
const STAR_FIELD = 'bg-[radial-gradient(1px_1px_at_20px_30px,rgb(245_165_36/0.6),transparent),radial-gradient(1px_1px_at_90px_80px,rgb(255_255_255/0.4),transparent),radial-gradient(1px_1px_at_160px_40px,rgb(192_45_0/0.6),transparent),radial-gradient(1px_1px_at_230px_120px,rgb(245_165_36/0.4),transparent),radial-gradient(1px_1px_at_280px_60px,rgb(255_255_255/0.3),transparent)]';
const STARS = `${DECOR} inset-0 opacity-20 bg-size-[320px_160px] ${STAR_FIELD}`;
const EMBER_ORB = `${DECOR} -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgb(192_45_0/0.18)_0%,transparent_65%)]`;
const PHOENIX_ORB = `${DECOR} -bottom-32 -left-20 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgb(245_165_36/0.12)_0%,transparent_65%)]`;

function HeroLogo()
{
  return (
    <div className="flex justify-center lg:justify-start animate-fade-up"><div className="relative w-56 h-56 sm:w-72 sm:h-72">
      <div className="absolute inset-0 -m-6 rounded-full animate-glow-pulse" /><img src="/AnkA-Interactive-Logo.png" alt="AnkA Interactive" className="relative w-full h-full object-contain drop-shadow-[0_0_45px_rgb(192_45_0/0.6)]" />
    </div></div>
  );
}

function HeroTitle()
{
  return (
    <>
      <div className="font-heading text-ember text-sm sm:text-base tracking-[0.5em] mb-3">EST. 2023 · ANKARA, TÜRKİYE</div>
      <h1 className={`font-deco font-black text-5xl sm:text-7xl lg:text-8xl leading-[0.95] mb-4 ${TEXT_GRADIENT_PHOENIX}`}>AnkA<br /><span className="font-display font-bold">Interactive</span></h1>
    </>
  );
}

function HeroText()
{
  const { t } = useLanguage();
  return (
    <div className="text-center lg:text-left animate-fade-up [animation-delay:120ms]">
      <HeroTitle /><p className="font-display text-xl sm:text-2xl lg:text-3xl text-parchment/85 tracking-wide max-w-2xl mx-auto lg:mx-0">{t('A Video Game Development Company', 'Bir Video Oyun Geliştirme Şirketi')}</p>
      <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start"><a href="#games" className={buttonClass('primary')}>{t('Explore Games', 'Oyunları Keşfet')}</a><a href="#about" className={buttonClass('ghost')}>{t('Our Story', 'Hikayemiz')}</a></div>
    </div>
  );
}

export function Hero()
{
  return (
    <header id="top" className="relative overflow-hidden">
      <div className={EMBER_GLOW} /><div className={STARS} /><div className={EMBER_ORB} /><div className={PHOENIX_ORB} />
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28"><div className="grid lg:grid-cols-[auto_1fr] items-center gap-8 lg:gap-14"><HeroLogo /><HeroText /></div></div>
    </header>
  );
}
