import { useEffect, useState } from 'react';
import { api, Station } from '@/lib/api';
import StationCard from '@/components/StationCard';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface Props {
  currentStation: Station | null;
  favorites: number[];
  onPlay: (s: Station) => void;
  onFavorite: (s: Station) => void;
}

export default function Catalog({ currentStation, favorites, onPlay, onFavorite }: Props) {
  const [stations, setStations] = useState<Station[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [activeGenre, setActiveGenre] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGenres().then(r => setGenres(r.genres || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (activeGenre) params.genre = activeGenre;
    api.getStations(params).then(r => {
      setStations(r.stations || []);
      setLoading(false);
    });
  }, [search, activeGenre]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide mb-1">Каталог</h1>
        <p className="text-muted-foreground text-sm">Все радиостанции России</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Icon name="Search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Поиск по названию, городу..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors placeholder:text-muted-foreground"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={14} />
          </button>
        )}
      </div>

      {/* Genre filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveGenre('')}
          className={cn(
            "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
            !activeGenre
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-secondary text-muted-foreground border-border hover:text-foreground"
          )}
        >
          Все
        </button>
        {genres.map(g => (
          <button
            key={g}
            onClick={() => setActiveGenre(activeGenre === g ? '' : g)}
            className={cn(
              "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
              activeGenre === g
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary text-muted-foreground border-border hover:text-foreground"
            )}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="text-xs text-muted-foreground mb-3">
        {loading ? 'Загрузка...' : `${stations.length} станций`}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-secondary animate-pulse" />
          ))}
        </div>
      ) : stations.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Icon name="SearchX" size={40} className="mx-auto mb-3 opacity-40" />
          <p>Станции не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {stations.map((s, i) => (
            <div key={s.id} className="animate-fade-in" style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}>
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
