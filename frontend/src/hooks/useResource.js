import { useCallback } from 'react';
import { useLoaded } from './useLoaded';

/** The value of a cached page-data service (services/index.js): `emptyValue` until it has loaded, at once when already cached. */
export function useResource(service, emptyValue)
{
  const load = useCallback(() => service.fetch(), [service]);
  const cached = useCallback(() => service.peek(), [service]);
  return useLoaded(load, emptyValue, cached);
}
