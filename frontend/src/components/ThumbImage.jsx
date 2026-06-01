import { useEffect, useState } from 'react';
import { resolveMedia, resolveThumb } from '../api/client';

/**
 * Renders the small "_thumb" variant of an uploaded image and transparently
 * falls back to the full-resolution image if the thumbnail is missing (e.g.
 * images uploaded before thumbnails existed, GIFs, or external URLs).
 *
 * Pass the RAW backend path (e.g. img.image_url) as `image` — resolving to the
 * thumbnail and the full URL is handled here.
 */
export default function ThumbImage({ image, alt = '', className = '', loading = 'lazy' }) {
    const thumb = resolveThumb(image);
    const full = resolveMedia(image);
    const [src, setSrc] = useState(thumb || full);

    // If the source path changes (e.g. list reorder/edit), reset to the thumb.
    useEffect(() => {
        setSrc(thumb || full);
    }, [thumb, full]);

    return (
        <img
            src={src}
            alt={alt}
            loading={loading}
            decoding="async"
            onError={() => { if (full && src !== full) setSrc(full); }}
            className={className}
        />
    );
}
