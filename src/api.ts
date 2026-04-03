import axios from 'axios';

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

function normalizeBaseUrl(url: string): string {
    return url.endsWith('/') ? url.slice(0, -1) : url;
}

const api = axios.create({
    // Use env in all environments; fallback keeps local dev working and avoids localhost in deployed builds.
    baseURL: normalizeBaseUrl(configuredBaseUrl || 'https://skill-share-platform.onrender.com/api'),
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
