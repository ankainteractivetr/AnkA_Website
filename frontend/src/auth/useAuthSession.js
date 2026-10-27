import { useCallback, useMemo, useState } from 'react';
import { useCurrentUserLoader } from './useCurrentUserLoader';

/** The signed-in admin plus login/logout actions, backed by an AuthService. */
export function useAuthSession(authService)
{
  const [user, setUser] = useState(null);
  const isLoading = useCurrentUserLoader(authService, setUser);
  const login = useCallback(async (username, password) => setUser(await authService.login(username, password)), [authService]);
  const logout = useCallback(() => authService.logout().then(() => setUser(null)), [authService]);
  return useMemo(() => ({ user, isLoading, login, logout }), [user, isLoading, login, logout]);
}
