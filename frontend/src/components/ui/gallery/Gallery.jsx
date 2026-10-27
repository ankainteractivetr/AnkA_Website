import { useLightbox } from '../../../hooks/useLightbox';
import { useLanguage } from '../../../i18n/useLanguage';
import { GalleryThumb } from './GalleryThumb';
import { Lightbox } from './Lightbox';

const LAYOUTS = Object.freeze({
  strip: { list: 'flex flex-wrap justify-center gap-3 mb-8', tile: 'w-32 sm:w-40 md:w-48 aspect-[4/3] hover:scale-[1.03]' },
  grid: { list: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-8', tile: 'aspect-video hover:z-10 hover:scale-[1.05]' },
});
const TILE = 'relative group rounded-xs overflow-hidden border border-ink-400 transition-all duration-300 hover:border-ember hover:shadow-glow-ember-sm';
const SHADE = 'absolute inset-0 bg-linear-to-t from-ink-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity';

function GalleryTile({ image, className, onOpen })
{
  const { t } = useLanguage();
  return (
    <button type="button" className={`${TILE} ${className}`} onClick={onOpen} aria-label={image.alt || t('Open image', 'Görseli aç')}>
      <GalleryThumb image={image} className="w-full h-full object-cover" /><span className={SHADE} />
    </button>
  );
}

/** Thumbnails as a `strip` (about) or a `grid` (screenshots); clicking one opens the full-size images in the lightbox. */
export function Gallery({ images, layout })
{
  const lightbox = useLightbox(images.length), { list, tile } = LAYOUTS[layout];
  if (images.length === 0) return null;
  return (
    <>
      <div className={list}>{images.map((image, index) => <GalleryTile key={image.id} image={image} className={tile} onOpen={() => lightbox.open(index)} />)}</div>{lightbox.index !== null && <Lightbox images={images} index={lightbox.index} onClose={lightbox.close} onNavigate={lightbox.show} />}
    </>
  );
}
