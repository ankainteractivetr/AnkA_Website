/**
 * Loads full-size images in the background, one at a time and only while `tracker` reports nothing loading — so the page's
 * data and every thumbnail on it always come first. A thumbnail that starts loading later pauses the queue again.
 * Loaded images stay referenced, so the browser keeps them ready and the lightbox opens them instantly.
 */
export class BackgroundImageQueue
{
  #tracker;
  #scheduler;
  #createImage;
  #pending = [];
  #images = new Map();
  #running = false;

  constructor(tracker, scheduler, createImage = () => new Image())
  {
    this.#tracker = tracker;
    this.#scheduler = scheduler;
    this.#createImage = createImage;
  }

  /** Queues `url` (once) behind the images already waiting. */
  enqueue(url)
  {
    if (!url || this.#images.has(url) || this.#pending.includes(url)) return;
    this.#pending.push(url);
    this.#continue();
  }

  #continue()
  {
    if (this.#running || this.#pending.length === 0) return;
    this.#running = true;
    this.#waitForQuiet();
  }

  /** Waits until nothing is loading and the browser is idle (React has rendered whatever the last request brought in). */
  #waitForQuiet()
  {
    this.#tracker.onceIdle(() => this.#scheduler.schedule(() => this.#loadNext()));
  }

  async #loadNext()
  {
    if (this.#tracker.busy) return this.#waitForQuiet();
    await this.#load(this.#pending.shift());
    this.#running = false;
    this.#continue();
  }

  #load(url)
  {
    const image = Object.assign(this.#createImage(), { decoding: 'async', fetchPriority: 'low' });
    this.#images.set(url, image);
    return new Promise((resolve) => Object.assign(image, { onload: resolve, onerror: resolve, src: url }));
  }
}
