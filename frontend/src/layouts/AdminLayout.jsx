import { Outlet } from 'react-router';
import { AuthProvider } from '../auth/AuthProvider';
import { authService } from '../services';

// Auth only wraps the CMS, so the public site never calls /api/auth/me.
export function AdminLayout()
{
  return (
    <AuthProvider authService={authService}>
      <Outlet />
    </AuthProvider>
  );
}
