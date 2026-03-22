import { useEffect, useState } from 'react';
import { api, Station } from '@/lib/api';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface StationForm {
  name: string;
  genre: string;
  description: string;
  stream_url: string;
  logo_url: string;
  city: string;
  frequency: string;
  is_active: boolean;
  is_featured: boolean;
  is_recommended: boolean;
  listeners_count: number;
}

const empty: StationForm = {
  name: '', genre: '', description: '', stream_url: '', logo_url: '',
  city: '', frequency: '', is_active: true, is_featured: false,
  is_recommended: false, listeners_count: 0,
};

const ADMIN_TOKEN = 'admin123';

export default function Admin() {
  const [authed, setAuthed] = useState(() => localStorage.getItem('admin_auth') === ADMIN_TOKEN);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<StationForm>(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);

  const login = () => {
    if (password === ADMIN_TOKEN) {
      localStorage.setItem('admin_auth', ADMIN_TOKEN);
      setAuthed(true);
    } else {
      setAuthError(true);
    }
  };

  const loadStations = () => {
    setLoading(true);
    api.adminGetStations().then(r => {
      setStations(r.stations || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (authed) loadStations();
  }, [authed]);

  const handleEdit = (s: Station) => {
    setForm({
      name: s.name, genre: s.genre || '', description: s.description || '',
      stream_url: s.stream_url, logo_url: s.logo_url || '', city: s.city || '',
      frequency: s.frequency || '', is_active: s.is_active,
      is_featured: s.is_featured, is_recommended: s.is_recommended,
      listeners_count: s.listeners_count,
    });
    setEditId(s.id);
    setShowForm(true);
  };

  const handleNew = () => {
    setForm(empty);
    setEditId(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editId) {
      await api.adminUpdateStation(editId, form);
    } else {
      await api.adminAddStation(form);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setShowForm(false);
    setEditId(null);
    loadStations();
  };

  const field = (key: keyof StationForm, label: string, type = 'text') => (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={String(form[key])}
        onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
        className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
      />
    </div>
  );

  if (!authed) {
    return (
      <div className="animate-fade-in max-w-sm mx-auto pt-10">
        <div className="p-8 rounded-2xl bg-card border border-border text-center">
          <Icon name="Shield" size={40} className="mx-auto mb-4 text-primary" />
          <h1 className="font-display text-2xl font-bold uppercase mb-1">Вход в админ</h1>
          <p className="text-muted-foreground text-sm mb-6">Введите пароль администратора</p>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => { setPassword(e.target.value); setAuthError(false); }}
            onKeyDown={e => e.key === 'Enter' && login()}
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-secondary border text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-primary/30",
              authError ? "border-destructive" : "border-border focus:border-primary/50"
            )}
          />
          {authError && <p className="text-destructive text-xs mb-3">Неверный пароль</p>}
          <button
            onClick={login}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide mb-1">Админ-панель</h1>
          <p className="text-muted-foreground text-sm">{stations.length} радиостанций</p>
        </div>
        <div className="flex gap-2">
          {saved && (
            <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/15 text-green-400 text-sm animate-scale-in">
              <Icon name="Check" size={14} /> Сохранено
            </span>
          )}
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Icon name="Plus" size={16} />
            Добавить
          </button>
          <button
            onClick={() => { localStorage.removeItem('admin_auth'); setAuthed(false); }}
            className="p-2.5 rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="LogOut" size={16} />
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 p-5 rounded-2xl bg-card border border-primary/30 animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{editId ? 'Редактировать станцию' : 'Новая станция'}</h2>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
              <Icon name="X" size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {field('name', 'Название *')}
            {field('genre', 'Жанр')}
            {field('stream_url', 'URL потока *')}
            {field('logo_url', 'URL логотипа')}
            {field('city', 'Город')}
            {field('frequency', 'Частота (FM)')}
            {field('listeners_count', 'Слушателей', 'number')}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Описание</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 resize-none"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            {(['is_active', 'is_featured', 'is_recommended'] as const).map(key => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[key] as boolean}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                  className="w-4 h-4 accent-orange-500 rounded"
                />
                <span className="text-sm">
                  {key === 'is_active' ? 'Активна' : key === 'is_featured' ? 'В топе' : 'Рекомендуемая'}
                </span>
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !form.name || !form.stream_url}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditId(null); }}
              className="px-6 py-2.5 bg-secondary text-foreground rounded-xl font-semibold text-sm hover:bg-border transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-secondary animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {stations.map(s => (
            <div
              key={s.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-border/60 transition-colors"
            >
              <div className={cn(
                "w-2 h-2 rounded-full shrink-0",
                s.is_active ? "bg-green-400" : "bg-muted-foreground"
              )} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{s.name}</div>
                <div className="text-xs text-muted-foreground truncate">{s.genre} · {s.city} · {s.frequency}</div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {s.is_featured && (
                  <span className="px-1.5 py-0.5 bg-primary/15 text-primary text-[10px] font-semibold rounded uppercase">ТОП</span>
                )}
                {s.is_recommended && (
                  <span className="px-1.5 py-0.5 bg-blue-500/15 text-blue-400 text-[10px] font-semibold rounded uppercase">Рек</span>
                )}
                <button
                  onClick={() => handleEdit(s)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                >
                  <Icon name="Pencil" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
