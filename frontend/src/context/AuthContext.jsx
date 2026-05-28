import { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client';

const AuthContext = createContext({ user: null, login: () => {}, logout: () => {}, loading: true });

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('anka_admin_token');
        const stored = localStorage.getItem('anka_admin_user');
        if (token && stored) {
            // Trust the stored profile; the request interceptor will boot us if the token is bad.
            try { setUser(JSON.parse(stored)); } catch {}
        }
        setLoading(false);
    }, []);

    async function login(username, password) {
        const { data } = await client.post('/admin/login', { username, password });
        if (data.success) {
            localStorage.setItem('anka_admin_token', data.token);
            const profile = { username: data.username };
            localStorage.setItem('anka_admin_user', JSON.stringify(profile));
            setUser(profile);
            return { ok: true };
        }
        return { ok: false, message: data.message };
    }

    function logout() {
        localStorage.removeItem('anka_admin_token');
        localStorage.removeItem('anka_admin_user');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
