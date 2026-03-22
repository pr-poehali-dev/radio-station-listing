import { useEffect, useState } from 'react';
import { api, HistoryItem, Station } from '@/lib/api';
import { getSessionId } from '@/lib/session';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Props {
  currentStation: Station | null;
  onPlay: (s: Station) => void;
}

const genreEmoji: Record<string, string> = {
  'Поп': '🎵', 'Рок': '🎸', 'Джаз': '🎷', 'Электронная': '🎛️',
  'Русская попса': '🎤', 'Разнообразная': '🎶', 'Новости/Разговорное': '📻',
  'Поп/Рок': '🎸',
};

export default function History({ currentStation, onPlay }: Props) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sid = getSessionId();
    api.getHistory(sid).then(r => {
      setHistory(r.history || []);
      setLoading(false);
    });
  }, []);

  function formatDuration(sec: number) {
    if (!sec) return null;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function groupByDate(items: HistoryItem[]) {
    const groups: Record<string, HistoryItem[]> = {};
    items.forEach(item => {
      const date = format(new Date(item.listened_at), 'd MMMM yyyy', { locale: ru });
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return groups;
  }

  const groups = groupByDate(history);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide mb-1">История</h1>
        <p className="text-muted-foreground text-sm">Ваши прослушивания</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-secondary animate-pulse" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Icon name="History" size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-1">История пуста</p>
          <p className="text-sm">Начните слушать радио — здесь появятся ваши прослушивания</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(groups).map(([date, items]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{date}</span>
                <span className="text-xs text-muted-foreground/50">· {items.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {items.map((item, i) => {
                  const stationForPlay: Station = {
                    id: item.station_id,
                    name: item.current_name || item.station_name,
                    genre: item.genre,
                    description: '',
                    stream_url: item.stream_url,
                    logo_url: item.logo_url,
                    city: '',
                    frequency: '',
                    is_active: true,
                    is_featured: false,
                    is_recommended: false,
                    listeners_count: 0,
                    created_at: '',
                  };
                  const isPlaying = currentStation?.id === item.station_id;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border border-border bg-card cursor-pointer group animate-fade-in",
                        "hover:border-border/80 hover:bg-secondary/50 transition-all",
                        isPlaying && "border-primary/40 bg-primary/5"
                      )}
                      style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                      onClick={() => onPlay(stationForPlay)}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-secondary shrink-0">
                        {item.logo_url
                          ? <img src={item.logo_url} className="w-full h-full object-cover rounded-xl" alt="" />
                          : genreEmoji[item.genre] || '📻'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{item.current_name || item.station_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(item.listened_at), 'HH:mm')}
                          {item.genre && ` · ${item.genre}`}
                          {item.duration_seconds > 0 && ` · ${formatDuration(item.duration_seconds)}`}
                        </div>
                      </div>
                      {isPlaying ? (
                        <div className="flex gap-0.5 items-end h-4 shrink-0">
                          <span className="wave-bar h-2.5" />
                          <span className="wave-bar h-4" />
                          <span className="wave-bar h-3" />
                          <span className="wave-bar h-4" />
                        </div>
                      ) : (
                        <button className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary opacity-0 group-hover:opacity-100 transition-all">
                          <Icon name="Play" size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
