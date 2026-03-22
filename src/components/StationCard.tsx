import { Station } from '@/lib/api';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/icon';

interface Props {
  station: Station;
  isPlaying?: boolean;
  isFavorite?: boolean;
  onPlay: (station: Station) => void;
  onFavorite?: (station: Station) => void;
  compact?: boolean;
}

const genreEmoji: Record<string, string> = {
  'Поп': '🎵', 'Рок': '🎸', 'Джаз': '🎷', 'Электронная': '🎛️',
  'Русская попса': '🎤', 'Разнообразная': '🎶', 'Новости/Разговорное': '📻',
  'Поп/Рок': '🎸',
};

const genreColor: Record<string, string> = {
  'Поп': 'bg-pink-500/15 text-pink-400',
  'Рок': 'bg-red-500/15 text-red-400',
  'Джаз': 'bg-amber-500/15 text-amber-400',
  'Электронная': 'bg-blue-500/15 text-blue-400',
  'Русская попса': 'bg-purple-500/15 text-purple-400',
  'Разнообразная': 'bg-green-500/15 text-green-400',
  'Новости/Разговорное': 'bg-slate-500/15 text-slate-400',
  'Поп/Рок': 'bg-orange-500/15 text-orange-400',
};

function formatListeners(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

export default function StationCard({ station, isPlaying, isFavorite, onPlay, onFavorite, compact }: Props) {
  const emoji = genreEmoji[station.genre] || '📻';
  const color = genreColor[station.genre] || 'bg-secondary text-muted-foreground';

  if (compact) {
    return (
      <div
        className={cn(
          "station-card flex items-center gap-3 p-3 rounded-xl border border-border bg-card cursor-pointer",
          isPlaying && "border-primary/40 bg-primary/5"
        )}
        onClick={() => onPlay(station)}
      >
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 bg-secondary",
          isPlaying && "neon-glow"
        )}>
          {station.logo_url
            ? <img src={station.logo_url} className="w-full h-full object-cover rounded-lg" alt="" />
            : emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{station.name}</div>
          <div className="text-xs text-muted-foreground truncate">{station.genre} · {station.city}</div>
        </div>
        {isPlaying && (
          <div className="flex gap-0.5 items-end h-4 shrink-0">
            <span className="wave-bar h-2.5" />
            <span className="wave-bar h-4" />
            <span className="wave-bar h-3" />
            <span className="wave-bar h-4" />
          </div>
        )}
        <button
          onClick={e => { e.stopPropagation(); if (!isPlaying) onPlay(station); }}
          className={cn("shrink-0 p-1.5 rounded-lg transition-colors", isPlaying ? "text-primary" : "text-muted-foreground hover:text-primary hover:bg-secondary")}
        >
          <Icon name={isPlaying ? "Pause" : "Play"} size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className={cn(
      "station-card group relative flex flex-col p-4 rounded-2xl border border-border bg-card cursor-pointer",
      isPlaying && "border-primary/50 bg-primary/5 neon-glow"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-secondary border border-border",
          isPlaying && "neon-glow"
        )}>
          {station.logo_url
            ? <img src={station.logo_url} className="w-full h-full object-cover rounded-2xl" alt="" />
            : emoji}
        </div>
        <div className="flex items-center gap-1.5">
          {onFavorite && (
            <button
              onClick={e => { e.stopPropagation(); onFavorite(station); }}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                isFavorite ? "text-red-400 bg-red-400/10" : "text-muted-foreground hover:text-red-400 hover:bg-secondary"
              )}
            >
              <Icon name="Heart" size={15} />
            </button>
          )}
          {station.is_featured && (
            <span className="px-1.5 py-0.5 bg-primary/15 text-primary text-[10px] font-semibold rounded uppercase tracking-wide">ТОП</span>
          )}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-sm mb-0.5 truncate">{station.name}</h3>
        {station.frequency && (
          <p className="text-xs text-muted-foreground mb-2">{station.frequency} · {station.city}</p>
        )}
        <span className={cn("inline-block px-2 py-0.5 rounded-full text-[11px] font-medium", color)}>
          {station.genre}
        </span>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Icon name="Users" size={12} />
          <span>{formatListeners(station.listeners_count)}</span>
        </div>
        <button
          onClick={() => onPlay(station)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
            isPlaying
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
          )}
        >
          {isPlaying ? (
            <>
              <span className="flex gap-0.5 items-end h-3">
                <span className="wave-bar h-2" />
                <span className="wave-bar h-3" />
                <span className="wave-bar h-2" />
              </span>
              В эфире
            </>
          ) : (
            <>
              <Icon name="Play" size={11} className="ml-0.5" />
              Слушать
            </>
          )}
        </button>
      </div>
    </div>
  );
}