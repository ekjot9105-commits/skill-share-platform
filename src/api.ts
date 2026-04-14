import axios from 'axios';

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

function normalizeBaseUrl(url: string): string {
    return url.endsWith('/') ? url.slice(0, -1) : url;
}

const isLocal = import.meta.env.DEV;
let fallbackUrl = isLocal ? '/api' : 'https://skill-share-platform.onrender.com/api';

// VERCEL FAILSAFE: If we are on a vercel domain but somehow picked up a localhost URL, force Render URL.
if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
  if (!configuredBaseUrl || configuredBaseUrl.includes('localhost')) {
    fallbackUrl = 'https://skill-share-platform.onrender.com/api';
  }
}

const api = axios.create({
    // Use proxy in local dev (bypasses Windows firewall), fallback to Render in production
    baseURL: normalizeBaseUrl(configuredBaseUrl || fallbackUrl),
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
