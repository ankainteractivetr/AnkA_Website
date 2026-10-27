import { useEffect, useState } from 'react';

const NOT_CACHED = () => undefined;

/**
 * Runs `load()` (a stable callback returning a promise) and returns its result; `emptyValue` until then
 * or on failure. A newer load (e.g. after a language change) wins over a slower older one. `cached()`, if given,
 * returns an already loaded value (or undefined), shown from the first render so a revisited page never flashes empty.
 */
export function useLoaded(load, emptyValue, cached = NOT_CACHED)
{
  const [value, setValue] = useState(() => cached() ?? emptyValue);
  useEffect(() => {
    let current = true;
    load().then((result) => current && setValue(result), () => current && setValue(emptyValue));
    return () => { current = false; };
  }, [load, emptyValue]);
  return value;
}
