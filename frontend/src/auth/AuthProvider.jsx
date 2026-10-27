import { AuthContext } from './authContext';
import { useAuthSession } from './useAuthSession';

export function AuthProvider({ authService, children })
{
  const session = useAuthSession(authService);
  return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>;
}
