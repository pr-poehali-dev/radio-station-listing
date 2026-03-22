const API_URL = 'https://functions.poehali.dev/debfb9ad-48c8-46b6-b0fd-24e1221e77ff';

export interface Station {
  id: number;
  name: string;
  genre: string;
  description: string;
  stream_url: string;
  logo_url: string | null;
  city: string;
  frequency: string;
  is_active: boolean;
  is_featured: boolean;
  is_recommended: boolean;
  listeners_count: number;
  created_at: string;
}

export interface HistoryItem {
  id: number;
  station_id: number;
  station_name: string;
  listened_at: string;
  duration_seconds: number;
  current_name: string;
  genre: string;
  logo_url: string | null;
  stream_url: string;
}

export interface Stats {
  total_stations: number;
  total_genres: number;
  user_listened: number;
  user_favorites: number;
}

async function get(action: string, params?: Record<string, string>, headers?: Record<string, string>) {
  try {
    const q = new URLSearchParams({ action, ...params }).toString();
    const res = await fetch(`${API_URL}?${q}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (e) {
    console.error(`[api] GET ${action}:`, e);
    return {};
  }
}

async function post(action: string, body: object, headers?: Record<string, string>) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ action, ...body }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (e) {
    console.error(`[api] POST ${action}:`, e);
    return {};
  }
}

export const api = {
  getStations: (params?: Record<string, string>) =>
    get('stations', params),
  getGenres: () => get('genres'),
  getStats: (sessionId?: string) =>
    get('stats', sessionId ? { session_id: sessionId } : {}),
  getHistory: (sessionId: string) =>
    get('history', { session_id: sessionId }),
  addHistory: (sessionId: string, stationId: number, stationName: string, duration = 0) =>
    post('history', { session_id: sessionId, station_id: stationId, station_name: stationName, duration_seconds: duration }),
  getFavorites: (sessionId: string) =>
    get('favorites', { session_id: sessionId }),
  toggleFavorite: (sessionId: string, stationId: number, action: 'add' | 'remove') =>
    post('favorites', { session_id: sessionId, station_id: stationId, fav_action: action }),
  adminGetStations: () =>
    get('admin_stations', { admin_token: 'admin123' }),
  adminAddStation: (data: Partial<Station>) =>
    post('admin_add', { admin_token: 'admin123', ...data }),
  adminUpdateStation: (id: number, data: Partial<Station>) =>
    post('admin_update', { admin_token: 'admin123', id, ...data }),
};