const VIDEO_ID = '([\\w-]{11})';
const LINKS = Object.freeze([
  new RegExp(`^https?://youtu\\.be/${VIDEO_ID}`, 'i'),
  new RegExp(`^https?://(?:www\\.|m\\.)?youtube(?:-nocookie)?\\.com/(?:watch\\?(?:\\S*&)?v=|embed/|shorts/|live/)${VIDEO_ID}`, 'i'),
]);

/** A YouTube video, read from any of its usual links (youtu.be/…, watch?v=…, embed/…, shorts/…, live/…). */
export class YouTubeVideo
{
  static #EMBED_BASE = 'https://www.youtube-nocookie.com/embed/';

  constructor(id)
  {
    this.id = id;
    this.embedUrl = `${YouTubeVideo.#EMBED_BASE}${id}`;
    Object.freeze(this);
  }

  /** The video a link points at, or null when it is not a YouTube video link. */
  static fromUrl(url)
  {
    const match = LINKS.map((pattern) => pattern.exec(url ?? '')).find(Boolean);
    return match ? new YouTubeVideo(match[1]) : null;
  }
}
