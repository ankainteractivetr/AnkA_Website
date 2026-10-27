import { useEffect, useState } from 'react';

/** Asks the API who is signed in (once) and reports whether that is still loading. */
export function useCurrentUserLoader(authService, setUser)
{
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    authService.getCurrentUser()
      .then(setUser, () => setUser(null))
      .finally(() => setIsLoading(false));
  }, [authService, setUser]);
  return isLoading;
}
