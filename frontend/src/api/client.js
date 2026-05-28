import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/** Resolve a media URL — local /uploads paths come from the backend; full URLs pass through. */
export function resolveMedia(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/uploads/')) return `${BACKEND_URL}${url}`;
    return url;
}

const client = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
    const token = localStorage.getItem('anka_admin_token');
    if (token && config.url && config.url.startsWith('/admin') && !config.url.endsWith('/login')) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

client.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401 && err.config?.url?.startsWith('/admin')) {
            localStorage.removeItem('anka_admin_token');
            localStorage.removeItem('anka_admin_user');
            if (!window.location.pathname.startsWith('/admin/login')) {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(err);
    }
);

/**
 * `api` is a thin convenience wrapper around the axios `client` that unwraps the
 * backend's `{ success, data }` envelope so callers can read `res.data` as the
 * actual payload. Endpoints that return `{ success, id }` etc. are normalized to
 * `{ data: { id } }` shape by the backend, so `res.data` always holds the payload.
 * Errors keep their full axios shape (err.response.data.message remains available).
 */
function unwrap(promise) {
    return promise.then((res) => {
        const body = res.data;
        const payload =
            body && typeof body === 'object' && 'data' in body ? body.data : body;
        return { ...res, data: payload, envelope: body };
    });
}

export const api = {
    get: (url, config) => unwrap(client.get(url, config)),
    post: (url, data, config) => unwrap(client.post(url, data, config)),
    put: (url, data, config) => unwrap(client.put(url, data, config)),
    patch: (url, data, config) => unwrap(client.patch(url, data, config)),
    delete: (url, config) => unwrap(client.delete(url, config)),
};

export default client;
