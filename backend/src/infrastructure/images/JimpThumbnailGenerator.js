import Jimp from 'jimp';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { ThumbnailGenerator } from '../../application/ports/ThumbnailGenerator.js';
import { ThumbnailPath } from '../../domain/value-objects/ThumbnailPath.js';

// GIF is left out on purpose: a thumbnail would lose its animation.
const THUMBNAILABLE = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const JPEG = /\.jpe?g$/i;

/**
 * Writes an image's "_thumb" copy next to it in the same format, scaled to fit `maxEdge` px (never enlarged).
 * Uses jimp — pure JavaScript, so it runs on shared hosting (cPanel / Passenger) without a native build.
 */
export class JimpThumbnailGenerator extends ThumbnailGenerator
{
  #maxEdge;
  #jpegQuality;

  constructor({ maxEdge, jpegQuality })
  {
    super();
    this.#maxEdge = maxEdge;
    this.#jpegQuality = jpegQuality;
  }

  async create(sourcePath, { force = false } = {})
  {
    const reason = await JimpThumbnailGenerator.#skipReason(sourcePath, force);
    if (reason) return { created: false, reason };
    const image = await Jimp.read(sourcePath);
    await this.#shrink(image, sourcePath).writeAsync(ThumbnailPath.of(sourcePath));
    return { created: true, reason: null };
  }

  #shrink(image, sourcePath)
  {
    const { width, height } = image.bitmap;
    if (Math.max(width, height) > this.#maxEdge) image.scaleToFit(this.#maxEdge, this.#maxEdge);
    if (JPEG.test(sourcePath)) image.quality(this.#jpegQuality);
    return image;
  }

  static async #skipReason(sourcePath, force)
  {
    if (ThumbnailPath.isThumbnail(sourcePath)) return 'source-is-thumbnail';
    if (!THUMBNAILABLE.has(path.extname(sourcePath).toLowerCase())) return 'unsupported-format';
    if (!force && (await JimpThumbnailGenerator.#exists(ThumbnailPath.of(sourcePath)))) return 'exists';
    return null;
  }

  static #exists(filePath)
  {
    return access(filePath).then(() => true, () => false);
  }
}
