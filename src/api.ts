import axios from 'axios';

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

function normalizeBaseUrl(url: string): string {
    return url.endsWith('/') ? url.slice(0, -1) : url;
}

const isLocal = import.meta.env.DEV;
const fallbackUrl = isLocal ? '/api' : 'https://skill-share-platform.onrender.com/api';

const api = axios.create({
    // Use proxy in local dev (bypasses Windows firewall), fallback to Render in production
    baseURL: normalizeBaseUrl(configuredBaseUrl || fallbackUrl),
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
