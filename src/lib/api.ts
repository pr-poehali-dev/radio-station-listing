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

async function request(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, options);
  return res.json();
}

export const api = {
  getStations: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/stations${q}`);
  },
  getGenres: () => request('/genres'),
  getStats: (sessionId?: string) => {
    const q = sessionId ? `?session_id=${sessionId}` : '';
    return request(`/stats${q}`);
  },
  getHistory: (sessionId: string) => request(`/history?session_id=${sessionId}`),
  addHistory: (sessionId: string, stationId: number, stationName: string, duration = 0) =>
    request('/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, station_id: stationId, station_name: stationName, duration_seconds: duration }),
    }),
  getFavorites: (sessionId: string) => request(`/favorites?session_id=${sessionId}`),
  toggleFavorite: (sessionId: string, stationId: number, action: 'add' | 'remove') =>
    request('/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, station_id: stationId, action }),
    }),
  adminGetStations: () =>
    request('/admin/stations', { headers: { 'x-admin-token': 'admin123' } }),
  adminAddStation: (data: Partial<Station>) =>
    request('/admin/stations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': 'admin123' },
      body: JSON.stringify(data),
    }),
  adminUpdateStation: (id: number, data: Partial<Station>) =>
    request(`/admin/stations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': 'admin123' },
      body: JSON.stringify(data),
    }),
};
