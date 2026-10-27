import { Outlet } from 'react-router';
import { useAuth } from './useAuth';

/** Renders the admin page when signed in, otherwise `fallback` (the login form) at the same address. */
export function RequireAuth({ fallback })
{
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  return user ? <Outlet /> : fallback;
}
