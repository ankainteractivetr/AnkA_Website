import { Navigate } from 'react-router';
import { RequireAuth } from '../auth/RequireAuth';
import { AdminShell } from '../components/admin/AdminShell';
import { AdminLayout } from '../layouts/AdminLayout';
import { HomePage } from '../pages/HomePage';
import { AboutEditorPage } from '../pages/admin/AboutEditorPage';
import { ClientWorkEditPage } from '../pages/admin/ClientWorkEditPage';
import { ContactEditorPage } from '../pages/admin/ContactEditorPage';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { LoginPage } from '../pages/admin/LoginPage';
import { ProjectEditPage } from '../pages/admin/ProjectEditPage';
import { ProjectsPage } from '../pages/admin/ProjectsPage';
import { ServicesPage } from '../pages/admin/ServicesPage';
import { SubmissionsPage } from '../pages/admin/SubmissionsPage';

// CMS sections inside the admin shell, under /admin (all behind <RequireAuth />, which shows the login form instead).
const ADMIN_PAGES = Object.freeze([
  { index: true, element: <DashboardPage /> },
  { path: 'about', element: <AboutEditorPage /> },
  { path: 'projects', element: <ProjectsPage /> },
  { path: 'projects/:id', element: <ProjectEditPage /> },
  { path: 'services', element: <ServicesPage /> },
  { path: 'services/:id', element: <ClientWorkEditPage /> },
  { path: 'contact', element: <ContactEditorPage /> },
  { path: 'submissions', element: <SubmissionsPage /> },
  { path: 'login', element: <Navigate to="/admin" replace /> },
]);

const ADMIN = { path: 'admin', element: <AdminLayout />, children: [{ element: <RequireAuth fallback={<LoginPage />} />, children: [{ element: <AdminShell />, children: ADMIN_PAGES }] }] };

/** Route table for useRoutes(): the one-page site, the CMS, and every other address back to the site. */
export const ROUTES = Object.freeze([
  { index: true, element: <HomePage /> },
  ADMIN,
  { path: '*', element: <Navigate to="/" replace /> },
]);
