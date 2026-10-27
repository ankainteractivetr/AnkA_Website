import { AboutSection } from '../components/home/AboutSection';
import { ContactSection } from '../components/home/contact/ContactSection';
import { Hero } from '../components/home/Hero';
import { ProjectsSection } from '../components/home/projects/ProjectsSection';
import { ServicesSection } from '../components/home/services/ServicesSection';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { LanguageToggle } from '../components/ui/LanguageToggle';
import { useHashScroll } from '../hooks/useHashScroll';
import { idleScheduler, pageLoading } from '../services';

const GAMES = Object.freeze({ en: 'Games', tr: 'Oyunlar' });
const SOFTWARE = Object.freeze({ en: 'Software', tr: 'Yazılımlar' });

/** The one-page site: hero, about, games, software, services and contact, then the footer. */
export function HomePage()
{
  useHashScroll(pageLoading, idleScheduler);
  return (
    <div className="relative">
      <Navbar /><main><Hero /><AboutSection /><ProjectsSection type="game" sectionId="games" title={GAMES} /><ProjectsSection type="software" sectionId="software" title={SOFTWARE} /><ServicesSection /><ContactSection /></main>
      <Footer /><LanguageToggle floating />
    </div>
  );
}
