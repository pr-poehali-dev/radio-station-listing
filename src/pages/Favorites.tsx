import { Station } from '@/lib/api';
import StationCard from '@/components/StationCard';
import Icon from '@/components/ui/icon';

interface Props {
  stations: Station[];
  currentStation: Station | null;
  favorites: number[];
  onPlay: (s: Station) => void;
  onFavorite: (s: Station) => void;
  loading?: boolean;
}

export default function Favorites({ stations, currentStation, favorites, onPlay, onFavorite, loading }: Props) {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide mb-1">Избранное</h1>
        <p className="text-muted-foreground text-sm">{stations.length} сохранённых станций</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-secondary animate-pulse" />
          ))}
        </div>
      ) : stations.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Icon name="Heart" size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-1">Нет избранных</p>
          <p className="text-sm">Добавляйте станции в избранное, нажав на сердечко</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {stations.map((s, i) => (
            <div key={s.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <StationCard
                station={s}
                isPlaying={currentStation?.id === s.id}
                isFavorite={favorites.includes(s.id)}
                onPlay={onPlay}
                onFavorite={onFavorite}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
