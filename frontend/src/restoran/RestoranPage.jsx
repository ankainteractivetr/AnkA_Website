import { CommissionCalculator } from './components/calculator/CommissionCalculator';
import { Faq } from './components/Faq';
import { Footer } from './components/Footer';
import { Hero } from './components/hero/Hero';
import { Packages } from './components/packages/Packages';
import { Reference } from './components/Reference';
import { SeffafMenu } from './components/SeffafMenu';
import { Steps } from './components/Steps';
import { StickyWhatsApp } from './components/StickyWhatsApp';
import { TopBar } from './components/TopBar';
import { WhyAnka } from './components/WhyAnka';

/** /restoran: the Turkish, phone-first landing page for restaurants and cafés. Texts live in content/restoran.tr.js. */
export function RestoranPage()
{
  return (
    <>
      <TopBar /><main><Hero /><SeffafMenu /><CommissionCalculator /><Packages /><Steps /><Reference /><WhyAnka /><Faq /></main><Footer /><StickyWhatsApp />
    </>
  );
}
