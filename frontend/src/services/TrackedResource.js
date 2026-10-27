/** Decorator for a read-only resource (anything with fetch() returning a promise): every fetch counts as page loading. */
export class TrackedResource
{
  #resource;
  #tracker;

  constructor(resource, tracker)
  {
    this.#resource = resource;
    this.#tracker = tracker;
  }

  fetch(...args)
  {
    return this.#tracker.track(this.#resource.fetch(...args));
  }
}
