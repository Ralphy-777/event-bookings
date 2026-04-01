const DEFAULT_API_BASE = 'https://event-backend-5-v9tx.onrender.com/api/user';

function isLocalApiUrl(value: string): boolean {
  try {
    const { hostname } = new URL(value);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

function isLocalFrontendHost(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

function resolveApiBase(): string {
  const configuredBase = (process.env.NEXT_PUBLIC_API_BASE || '').trim().replace(/\/$/, '');
  if (!configuredBase) return DEFAULT_API_BASE;
  if (isLocalApiUrl(configuredBase) && !isLocalFrontendHost()) return DEFAULT_API_BASE;
  return configuredBase;
}

export const API_BASE = resolveApiBase();

export const APP_BASE = typeof window === 'undefined'
  ? 'https://event-bookings-mocmuxl39-ralphy-777s-projects.vercel.app'
  : window.location.origin;

export const WS_BASE = API_BASE
  .replace(/\/api\/user$/, '')
  .replace(/^http:\/\//, 'ws://')
  .replace(/^https:\/\//, 'wss://');

async function refreshAccessToken(tokenKey: 'clientToken' | 'organizerToken'): Promise<string | null> {
  const refreshKey = tokenKey === 'clientToken' ? 'clientRefresh' : 'organizerRefresh';
  const refresh = localStorage.getItem(refreshKey);
  if (!refresh) return null;
  try {
    const res = await fetch(`${API_BASE}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    localStorage.setItem(tokenKey, data.access);
    return data.access;
  } catch { return null; }
}

export async function apiFetch(
  url: string,
  options: RequestInit = {},
  tokenKey: 'clientToken' | 'organizerToken' = 'clientToken'
): Promise<Response> {
  const token = localStorage.getItem(tokenKey);
  const headers = { ...(options.headers || {}), Authorization: `Bearer ${token}` } as Record<string, string>;
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    const newToken = await refreshAccessToken(tokenKey);
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(url, { ...options, headers });
    }
  }
  return res;
}
