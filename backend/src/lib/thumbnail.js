// ============================================================================
//  Thumbnail library — generates a small "_thumb" variant next to an image.
//
//  Convention (shared with the frontend, see frontend/src/api/client.js):
//      foo.png        ->  foo_thumb.png
//      1717-abcd.jpg  ->  1717-abcd_thumb.jpg
//
//  The thumbnail always keeps the SAME extension as the source so the frontend
//  can derive its URL without any extra database field. Thumbnails are never
//  upscaled — small images are copied at their original size.
//
//  Uses `jimp` (pure JavaScript, no native binaries) so it runs reliably on
//  shared cPanel / Passenger hosting without a build step.
// ============================================================================
const path = require('path');
const fs = require('fs');
const Jimp = require('jimp');

// Longest edge of the generated thumbnail, in pixels. Configurable via .env.
const THUMB_MAX = Number(process.env.THUMB_MAX_PX) || 480;

// JPEG quality for .jpg/.jpeg thumbnails (PNG/WEBP are written losslessly).
const THUMB_JPEG_QUALITY = Number(process.env.THUMB_JPEG_QUALITY) || 82;

const THUMB_SUFFIX = '_thumb';

// Formats we attempt to thumbnail. GIF is intentionally excluded (animation).
const THUMBABLE = new Set(['.jpg', '.jpeg', '.png', '.webp']);

/** Absolute/relative file path of the thumbnail for a given image path. */
function thumbPathFor(filePath) {
    const ext = path.extname(filePath);
    const base = filePath.slice(0, filePath.length - ext.length);
    return `${base}${THUMB_SUFFIX}${ext}`;
}

/** Public URL of the thumbnail for a given image URL (e.g. /uploads/x.png -> /uploads/x_thumb.png). */
function thumbUrlFor(urlPath) {
    if (!urlPath) return urlPath;
    const ext = path.posix.extname(urlPath);
    if (!ext) return urlPath;
    const base = urlPath.slice(0, urlPath.length - ext.length);
    return `${base}${THUMB_SUFFIX}${ext}`;
}

/** True when the given path already points at a thumbnail (…_thumb.ext). */
function isThumbPath(filePath) {
    const ext = path.extname(filePath);
    const stem = path.basename(filePath, ext);
    return stem.endsWith(THUMB_SUFFIX);
}

/**
 * Generate a thumbnail next to `srcPath`.
 * Returns { ok, thumbPath, skipped?, reason? }. Never throws for the common
 * "can't / shouldn't make a thumbnail" cases — only a genuine processing error
 * (e.g. corrupt image) rejects, so callers should still wrap in try/catch.
 *
 * @param {string} srcPath  Absolute path to the source image.
 * @param {object} [opts]
 * @param {boolean} [opts.force=false]  Re-create the thumbnail even if it exists.
 */
async function generateThumbnail(srcPath, opts = {}) {
    const { force = false } = opts;
    const ext = path.extname(srcPath).toLowerCase();
    const thumbPath = thumbPathFor(srcPath);

    if (isThumbPath(srcPath)) return { ok: false, skipped: true, reason: 'source-is-thumb', thumbPath: srcPath };
    if (!THUMBABLE.has(ext)) return { ok: false, skipped: true, reason: 'unsupported-format', thumbPath };
    if (!fs.existsSync(srcPath)) return { ok: false, skipped: true, reason: 'missing-source', thumbPath };
    if (!force && fs.existsSync(thumbPath)) return { ok: true, skipped: true, reason: 'exists', thumbPath };

    const image = await Jimp.read(srcPath);
    const { width, height } = image.bitmap;

    // Only ever scale down — never enlarge a small image.
    if (Math.max(width, height) > THUMB_MAX) {
        image.scaleToFit(THUMB_MAX, THUMB_MAX);
    }

    if (ext === '.jpg' || ext === '.jpeg') {
        image.quality(THUMB_JPEG_QUALITY);
    }

    await image.writeAsync(thumbPath);
    return { ok: true, thumbPath };
}

module.exports = {
    generateThumbnail,
    thumbPathFor,
    thumbUrlFor,
    isThumbPath,
    THUMB_MAX,
    THUMB_SUFFIX,
    THUMBABLE,
};
