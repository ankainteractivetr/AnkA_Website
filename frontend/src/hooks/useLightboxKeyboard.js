import { useEffect } from 'react';

/** Locks page scrolling while the lightbox is open. */
function lockPageScroll()
{
  document.body.classList.add('overflow-hidden');
  return () => document.body.classList.remove('overflow-hidden');
}

/** Esc closes the lightbox, ← and → step through its images. */
export function useLightboxKeyboard(index, onClose, onNavigate)
{
  useEffect(() => lockPageScroll(), []);
  useEffect(() => {
    const keys = { Escape: onClose, ArrowLeft: () => onNavigate(index - 1), ArrowRight: () => onNavigate(index + 1) };
    const onKey = (event) => keys[event.key]?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, onClose, onNavigate]);
}
