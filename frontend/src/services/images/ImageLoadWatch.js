/**
 * Watches one <img> element: `promise` resolves once the image has loaded or failed (at once if it already has),
 * or when the watch is released (e.g. the element unmounts), so a tracker counting it never waits forever.
 */
export class ImageLoadWatch
{
  #element;
  #resolve;

  constructor(element)
  {
    this.#element = element;
    this.promise = new Promise((resolve) => { this.#resolve = resolve; });
    if (!element || element.complete) return void this.release();
    element.addEventListener('load', this.release);
    element.addEventListener('error', this.release);
  }

  release = () =>
  {
    this.#element?.removeEventListener('load', this.release);
    this.#element?.removeEventListener('error', this.release);
    this.#resolve();
  };
}
