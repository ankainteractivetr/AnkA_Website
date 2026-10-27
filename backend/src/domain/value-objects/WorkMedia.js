import { ValidationError } from '../errors.js';
import { Input } from './Input.js';
import { YouTubeVideo } from './YouTubeVideo.js';

/**
 * What the Services section frames for a client work: its website ('web'), or for an app its YouTube video ('app').
 * `embedUrl` is the address the frame loads; each kind derives it from `url` its own way (strategy), null when it cannot.
 */
export class WorkMedia
{
  static #EMBEDDERS = Object.freeze({
    web: (url) => url,
    app: (url) => YouTubeVideo.fromUrl(url)?.embedUrl ?? null,
  });

  static KINDS = Object.freeze(Object.keys(WorkMedia.#EMBEDDERS));

  constructor(kind, url)
  {
    this.kind = kind;
    this.url = url;
    this.embedUrl = WorkMedia.#EMBEDDERS[kind](url);
    Object.freeze(this);
  }

  /** Factory for admin input: an app's address must be a YouTube video link. */
  static create(input)
  {
    const media = input ?? {};
    const created = new WorkMedia(Input.oneOf(media.kind, WorkMedia.KINDS, 'Kind'), Input.url(media.url, 'URL'));
    if (!created.embedUrl) throw new ValidationError('An app needs a YouTube video link (e.g. https://youtu.be/...).');
    return created;
  }
}
