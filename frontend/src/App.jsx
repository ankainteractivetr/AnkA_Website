import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Home from './pages/Home';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AboutEditor from './pages/admin/AboutEditor';
import ProjectsList from './pages/admin/ProjectsList';
import ProjectEditor from './pages/admin/ProjectEditor';
import ContactEditor from './pages/admin/ContactEditor';
import Submissions from './pages/admin/Submissions';

function RequireAuth({ children }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/admin/login" replace />;
    return children;
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
                path="/admin"
                element={
                    <RequireAuth>
                        <AdminLayout />
                    </RequireAuth>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="about" element={<AboutEditor />} />
                <Route path="projects" element={<ProjectsList />} />
                <Route path="projects/new" element={<ProjectEditor />} />
                <Route path="projects/:id" element={<ProjectEditor />} />
                <Route path="contact" element={<ContactEditor />} />
                <Route path="submissions" element={<Submissions />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}
