import axios from 'axios';

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

function normalizeBaseUrl(url: string): string {
    return url.endsWith('/') ? url.slice(0, -1) : url;
}

const isLocal = window.location.hostname === 'localhost' || window.location.hostname.startsWith('192.168.') || window.location.hostname.startsWith('10.');
const fallbackUrl = isLocal ? `http://${window.location.hostname}:5001/api` : 'https://skill-share-platform.onrender.com/api';

const api = axios.create({
    // Use env in all environments; fallback keeps local dev working and avoids localhost in deployed builds.
    baseURL: normalizeBaseUrl(configuredBaseUrl || fallbackUrl),
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
