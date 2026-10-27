import { createPortal } from 'react-dom';
import { useLightboxKeyboard } from '../../../hooks/useLightboxKeyboard';
import { useLanguage } from '../../../i18n/useLanguage';
import { Icon } from '../Icon';

const OVERLAY = 'fixed inset-0 z-[100] bg-ink-900/95 backdrop-blur-xl flex items-center justify-center p-4';
const PICTURE = 'max-w-[90vw] max-h-[85vh] object-contain rounded-xs shadow-glow-ember';
const CONTROL = 'absolute z-10 text-parchment hover:text-ember transition-colors';
const STEP = `${CONTROL} top-1/2 -translate-y-1/2 p-3`;
const stopPropagation = (event) => event.stopPropagation();

function LightboxControls({ index, count, onClose, onNavigate })
{
  const { t } = useLanguage(), step = (delta) => (event) => { event.stopPropagation(); onNavigate(index + delta); };
  return (
    <>
      <button type="button" className={`${CONTROL} top-4 right-4 p-2`} onClick={onClose} aria-label={t('Close', 'Kapat')}><Icon name="close" size={32} /></button>
      {count > 1 && <><button type="button" className={`${STEP} left-4`} onClick={step(-1)} aria-label={t('Previous', 'Önceki')}><Icon name="previous" size={40} /></button><button type="button" className={`${STEP} right-4`} onClick={step(1)} aria-label={t('Next', 'Sonraki')}><Icon name="next" size={40} /></button><div className="absolute bottom-4 inset-x-0 text-center text-ash font-heading tracking-widest">{index + 1} / {count}</div></>}
    </>
  );
}

/**
 * Full-screen viewer of a gallery's full-size images: a click outside or Esc closes it; the arrows and ← → step through them.
 * Rendered into <body>: the gallery's card has a backdrop filter and an animation transform, which would trap a fixed overlay.
 */
export function Lightbox({ images, index, onClose, onNavigate })
{
  const { t } = useLanguage(), image = images[index];
  useLightboxKeyboard(index, onClose, onNavigate);
  return createPortal(
    <div className={OVERLAY} onClick={onClose} role="dialog" aria-modal="true" aria-label={t('Image viewer', 'Görsel görüntüleyici')}>
      <LightboxControls index={index} count={images.length} onClose={onClose} onNavigate={onNavigate} /><img src={image.fullUrl} alt={image.alt} onClick={stopPropagation} className={PICTURE} />
    </div>, document.body);
}
