import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import ProjectsSection from '../components/ProjectsSection';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import LanguageToggle from '../components/LanguageToggle';

export default function Home() {
  useEffect(() => {
    // Smooth-scroll into view if the URL arrives with a hash
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, []);

  return (
    <div className="relative">
      <Navbar />

      <main>
        {/* Each section below owns its own LEADING separator and hides it when
            the section has no content, so there is exactly one separator per
            visible boundary — never doubled, never orphaned. */}
        <Hero />

        <About />

        <ProjectsSection
          type="game"
          sectionId="games"
          titleEn="Games"
          titleTr="Oyunlar"
        />

        <ProjectsSection
          type="software"
          sectionId="software"
          titleEn="Software"
          titleTr="Yazılımlar"
        />

        <Contact />

        <Footer />
      </main>

      <LanguageToggle floating />
    </div>
  );
}
