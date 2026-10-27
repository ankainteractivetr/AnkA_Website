/**
 * Counts the page data requests still in flight and notifies subscribers whenever the count changes (observer),
 * so the loading screen can cover a page until its content has arrived.
 */
export class LoadingTracker
{
  #pending = 0;
  #listeners = new Set();

  get busy()
  {
    return this.#pending > 0;
  }

  /** Counts `promise` as pending until it settles, either way; returns it unchanged. */
  track(promise)
  {
    const settle = () => this.#change(-1);
    this.#change(1);
    promise.then(settle, settle);
    return promise;
  }

  /** Registers `listener` for changes; returns the unsubscribe function. */
  subscribe(listener)
  {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  /** Calls `listener` once, the first time no request is pending (at once if none is); returns the cancel function. */
  onceIdle(listener)
  {
    if (!this.busy)
    {
      listener();
      return () => {};
    }
    const stop = this.subscribe(() => this.#notifyIdle(stop, listener));
    return stop;
  }

  #notifyIdle(stop, listener)
  {
    if (this.busy) return;
    stop();
    listener();
  }

  #change(step)
  {
    this.#pending += step;
    this.#listeners.forEach((listener) => listener());
  }
}
