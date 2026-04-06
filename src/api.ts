import axios from 'axios';

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

function normalizeBaseUrl(url: string): string {
    return url.endsWith('/') ? url.slice(0, -1) : url;
}

const api = axios.create({
    // Prioritize localhost for local development if VITE_API_BASE_URL is not set
    baseURL: normalizeBaseUrl(configuredBaseUrl || 'http://localhost:3000/api'),
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
