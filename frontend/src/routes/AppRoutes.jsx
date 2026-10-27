import { useRoutes } from 'react-router';
import { ROUTES } from './routes';

export function AppRoutes()
{
  return useRoutes(ROUTES);
}
