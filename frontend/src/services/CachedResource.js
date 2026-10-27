/**
 * Decorator for a read-only resource (anything with fetch() returning a promise): the first fetch for given arguments
 * is shared by every later one, so a page visited again shows at once. A failed fetch is forgotten, so the next one retries.
 */
export class CachedResource
{
  #resource;
  #requests = new Map();
  #values = new Map();

  constructor(resource)
  {
    this.#resource = resource;
  }

  fetch(...args)
  {
    const key = JSON.stringify(args);
    if (!this.#requests.has(key)) this.#requests.set(key, this.#request(key, args));
    return this.#requests.get(key);
  }

  /** The value an earlier fetch with these arguments resolved to, or undefined; lets a page render it at once. */
  peek(...args)
  {
    return this.#values.get(JSON.stringify(args));
  }

  #request(key, args)
  {
    const promise = this.#resource.fetch(...args);
    promise.then((value) => this.#values.set(key, value), () => this.#requests.delete(key));
    return promise;
  }
}
