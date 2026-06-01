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

/**
 * Resolve the thumbnail URL for a media path. Mirrors the backend convention
 * (see backend/src/lib/thumbnail.js): the "_thumb" suffix is inserted before
 * the file extension — /uploads/foo.png -> /uploads/foo_thumb.png — then the
 * result is resolved like resolveMedia(). External (http) URLs have no generated
 * thumbnail, so the original URL is returned unchanged.
 */
export function resolveThumb(url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url; // external image, no thumb
    // Split off any query/hash before locating the extension.
    const m = url.match(/^([^?#]*)([?#].*)?$/);
    const cleanPath = m ? m[1] : url;
    const suffix = m && m[2] ? m[2] : '';
    const slash = cleanPath.lastIndexOf('/');
    const dot = cleanPath.lastIndexOf('.');
    if (dot <= slash) return resolveMedia(url); // no extension -> nothing to derive
    const thumbPath = `${cleanPath.slice(0, dot)}_thumb${cleanPath.slice(dot)}${suffix}`;
    return resolveMedia(thumbPath);
}

// Keeps references to in-flight/decoded preload images so the browser doesn't
// evict them before the user opens the lightbox. Also dedupes repeat requests.
const _preloaded = new Map();

/**
 * Warm the browser cache with full-resolution images (already-resolved URLs).
 * Runs during idle time so it never competes with the initial page render —
 * by the time a visitor clicks a thumbnail, the full image is ready instantly.
 */
export function preloadImages(urls) {
    if (typeof window === 'undefined' || !Array.isArray(urls)) return;

    const run = () => {
        for (const url of urls) {
            if (!url || _preloaded.has(url)) continue;
            const img = new Image();
            img.decoding = 'async';
            img.src = url;
            _preloaded.set(url, img);
        }
    };

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(run, { timeout: 3000 });
    } else {
        window.setTimeout(run, 1200);
    }
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
