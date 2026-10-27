import { useGalleryImages } from '../../../hooks/useGalleryImages';
import { useLanguage } from '../../../i18n/useLanguage';
import { Gallery } from '../../ui/gallery/Gallery';
import { RichText } from '../../ui/RichText';
import { PANEL, TEXT_GRADIENT_EMBER } from '../../ui/styles';
import { ProjectLinks } from './ProjectLinks';

function ProjectHeader({ project })
{
  const { pick } = useLanguage(), tagline = pick(project.tagline), status = pick(project.status);
  return (
    <header className="mb-6 text-center">
      <h3 className={`font-deco font-black text-3xl sm:text-5xl mb-2 leading-tight ${TEXT_GRADIENT_EMBER}`}>{project.title}</h3>{tagline && <p className="font-accent text-xl sm:text-2xl text-phoenix">{tagline}</p>}
      {status && <div className="inline-block mt-3 px-4 py-1 border border-ember/40 bg-ember/5 rounded-xs"><span className="font-heading text-xs sm:text-sm tracking-[0.25em] text-phoenix-light">{status}</span></div>}
    </header>
  );
}

function ProjectStory({ project })
{
  const { t, pick } = useLanguage(), features = pick(project.features);
  return (
    <>
      <RichText text={pick(project.description)} className="max-w-3xl mx-auto text-base sm:text-lg mb-8" />
      {features && <div className="max-w-3xl mx-auto mt-6 mb-8"><h4 className="font-heading text-2xl tracking-[0.2em] text-ember mb-4 text-center">{t('Key Features', 'Öne Çıkan Özellikler')}</h4><RichText text={features} className="border-l-2 border-ember/40 pl-5 italic" /></div>}
    </>
  );
}

/** One game or software title; its id is the slug, so /#shahmaran links straight to it. */
export function ProjectCard({ project })
{
  const images = useGalleryImages(project.images);
  return (
    <article id={project.slug} className={`${PANEL} p-6 sm:p-10 mb-10 scroll-mt-24 animate-fade-up`}>
      <ProjectHeader project={project} /><Gallery images={images} layout="grid" /><ProjectStory project={project} /><ProjectLinks links={project.links} title={project.title} />
    </article>
  );
}
