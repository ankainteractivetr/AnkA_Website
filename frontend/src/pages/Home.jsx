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
    // Smooth-scroll into view if the URL arrives with a hash.
    // The target (e.g. a project card like #shahmaran) is rendered only after
    // its section fetches data from the API, so on a cold load it does not exist
    // yet. Poll until it appears, then scroll — capped so we never loop forever.
    const raw = window.location.hash.slice(1);
    if (!raw) return;
    let id;
    try { id = decodeURIComponent(raw); } catch { id = raw; }

    let cancelled = false;
    let timer;
    const startedAt = Date.now();

    const scrollWhenReady = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (Date.now() - startedAt < 10000) {
        timer = setTimeout(scrollWhenReady, 100);
      }
    };

    scrollWhenReady();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
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
