import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getSessionId } from '@/lib/session';
import Icon from '@/components/ui/icon';

export default function Profile() {
  const [stats, setStats] = useState({ total_stations: 0, total_genres: 0, user_listened: 0, user_favorites: 0 });
  const [loading, setLoading] = useState(true);
  const sessionId = getSessionId();

  useEffect(() => {
    api.getStats(sessionId).then(s => {
      setStats(s);
      setLoading(false);
    });
  }, []);

  const shortId = sessionId.slice(5, 13).toUpperCase();

  return (
    <div className="animate-fade-in max-w-lg">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide mb-1">Профиль</h1>
        <p className="text-muted-foreground text-sm">Ваша статистика и настройки</p>
      </div>

      {/* Avatar block */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/40 to-primary/10 border border-primary/30 flex items-center justify-center">
          <Icon name="User" size={28} className="text-primary" />
        </div>
        <div>
          <div className="font-semibold text-lg">Слушатель #{shortId}</div>
          <div className="text-xs text-muted-foreground font-mono mt-1 opacity-60">{sessionId.slice(0, 20)}...</div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: 'Прослушано станций', value: loading ? '—' : stats.user_listened, icon: 'Headphones', color: 'text-primary' },
          { label: 'В избранном', value: loading ? '—' : stats.user_favorites, icon: 'Heart', color: 'text-red-400' },
          { label: 'Станций в каталоге', value: loading ? '—' : stats.total_stations, icon: 'Radio', color: 'text-blue-400' },
          { label: 'Жанров доступно', value: loading ? '—' : stats.total_genres, icon: 'Music', color: 'text-green-400' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-2xl bg-card border border-border">
            <div className={`mb-2 ${s.color}`}>
              <Icon name={s.icon} fallback="Radio" size={20} />
            </div>
            <div className="font-display text-2xl font-bold mb-0.5">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Session info */}
      <div className="p-4 rounded-xl bg-secondary border border-border">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={16} className="text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Как работает профиль</p>
            <p>Ваша история и избранное хранятся анонимно по уникальному ID сессии. Данные сохраняются в браузере автоматически.</p>
          </div>
        </div>
      </div>
    </div>
  );
}