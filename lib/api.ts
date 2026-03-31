export const API_BASE = 'http://localhost:8000/api/user';

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
  let token = localStorage.getItem(tokenKey);
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
