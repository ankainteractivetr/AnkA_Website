import { useCallback } from 'react';
import { useAdminList } from '../../../hooks/admin/useAdminList';
import { useListActions } from '../../../hooks/admin/useListActions';
import { useLanguage } from '../../../i18n/useLanguage';
import { AdminThumb } from '../ui/AdminThumb';
import { ErrorNotice, Loading } from '../ui/Notice';
import { RowControls } from '../ui/RowControls';
import { CARD, CARD_TITLE, MUTED, TILE } from '../ui/styles';
import { UploadButton } from './UploadButton';

function GalleryTile({ image, index, count, onMove, onRemove })
{
  return (
    <div className={TILE}>
      <div className="aspect-video bg-ink-900 overflow-hidden"><AdminThumb url={image.url} alt={image.alt} className="w-full h-full object-cover" /></div>
      <div className="p-3 flex items-center justify-between gap-2"><div className="text-xs text-ash/60 truncate flex-1">{image.alt || `#${index + 1}`}</div><RowControls index={index} count={count} onMove={onMove} onRemove={onRemove} /></div>
    </div>
  );
}

function GalleryGrid({ images, actions })
{
  const { t } = useLanguage();
  if (images === null) return <Loading />;
  if (images.length === 0) return <div className={`${CARD} text-center ${MUTED}`}>{t('No images yet.', 'Henüz görsel yok.')}</div>;
  const remove = (image) => window.confirm(t('Delete this image?', 'Bu görsel silinsin mi?')) && actions.remove(image);
  return <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{images.map((image, index) => <GalleryTile key={image.id} image={image} index={index} count={images.length} onMove={(position, delta) => actions.move(images, position, delta)} onRemove={() => remove(image)} />)}</div>;
}

/** A CMS gallery (an AdminGallery): upload, reorder and delete images; each change is saved at once. `altText` labels new uploads. */
export function GalleryManager({ gallery, title, altText = '' })
{
  const load = useCallback(() => gallery.list(), [gallery]), list = useAdminList(load), actions = useListActions(list, gallery);
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 flex-wrap"><h2 className={CARD_TITLE}>{title}</h2><UploadButton busy={list.busy} onFile={(file) => actions.add(() => gallery.upload(file, altText))} /></div>
      <ErrorNotice error={list.error} /><GalleryGrid images={list.items} actions={actions} />
    </section>
  );
}
