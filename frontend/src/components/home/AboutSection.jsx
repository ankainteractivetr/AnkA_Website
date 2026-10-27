import { useGalleryImages } from '../../hooks/useGalleryImages';
import { useResource } from '../../hooks/useResource';
import { useLanguage } from '../../i18n/useLanguage';
import { aboutService } from '../../services';
import { Gallery } from '../ui/gallery/Gallery';
import { RichText } from '../ui/RichText';
import { SectionShell } from '../ui/SectionShell';
import { PANEL } from '../ui/styles';

function AboutPanel({ about })
{
  const { pick } = useLanguage(), images = useGalleryImages(about.images);
  return (
    <div className={`${PANEL} p-6 sm:p-10`}>
      <h3 className="font-deco text-3xl sm:text-4xl text-parchment text-center mb-8">{about.title || 'AnkA Interactive'}</h3><Gallery images={images} layout="strip" />
      <RichText text={pick(about.body)} className="max-w-3xl mx-auto text-base sm:text-lg" />
    </div>
  );
}

/** The studio's story with its photo strip; hidden (with its separator) until the API has answered. */
export function AboutSection()
{
  const about = useResource(aboutService, null), { t } = useLanguage();
  if (!about) return null;
  return <SectionShell id="about" title={t('About', 'Hakkımızda')}><AboutPanel about={about} /></SectionShell>;
}
