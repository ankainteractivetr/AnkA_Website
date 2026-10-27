const FALLBACK_DELAY_MS = 200;
const IDLE_TIMEOUT_MS = 2000;

/** Runs callbacks once the browser is idle (requestIdleCallback), or after a short delay where that is not supported. */
export class IdleScheduler
{
  #window;

  constructor(windowObject = window)
  {
    this.#window = windowObject;
  }

  /** Schedules `callback`; returns the function that cancels it. */
  schedule(callback)
  {
    if (!('requestIdleCallback' in this.#window)) return this.#scheduleTimeout(callback);
    const id = this.#window.requestIdleCallback(callback, { timeout: IDLE_TIMEOUT_MS });
    return () => this.#window.cancelIdleCallback(id);
  }

  #scheduleTimeout(callback)
  {
    const id = this.#window.setTimeout(callback, FALLBACK_DELAY_MS);
    return () => this.#window.clearTimeout(id);
  }
}
