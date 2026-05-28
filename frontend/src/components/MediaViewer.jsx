import { useEffect } from 'react';

export default function MediaViewer({ images, currentIndex, onClose, onNavigate }) {
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
            else if (e.key === 'ArrowLeft') onNavigate(currentIndex - 1);
            else if (e.key === 'ArrowRight') onNavigate(currentIndex + 1);
        };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [currentIndex, onClose, onNavigate]);

    if (!images || images.length === 0) return null;
    const idx = ((currentIndex % images.length) + images.length) % images.length;
    const src = images[idx];

    return (
        <div
            className="fixed inset-0 z-[100] bg-ink-900/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-parchment hover:text-ember transition-colors p-2 z-10"
                aria-label="Close"
            >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                </svg>
            </button>

            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); onNavigate(idx - 1); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-parchment hover:text-ember transition-colors p-3 z-10"
                        aria-label="Previous"
                    >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onNavigate(idx + 1); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-parchment hover:text-ember transition-colors p-3 z-10"
                        aria-label="Next"
                    >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </>
            )}

            <img
                src={src}
                alt=""
                onClick={(e) => e.stopPropagation()}
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-sm shadow-ember"
            />

            {images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 text-center text-ash font-heading tracking-widest">
                    {idx + 1} / {images.length}
                </div>
            )}
        </div>
    );
}
