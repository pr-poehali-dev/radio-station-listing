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

export default function Home({ currentStation, favorites, onPlay, onFavorite }: Props) {
  const [featured, setFeatured] = useState<Station[]>([]);
  const [recommended, setRecommended] = useState<Station[]>([]);
  const [stats, setStats] = useState({ total_stations: 0, total_genres: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getStations({ featured: 'true' }),
      api.getStations({ recommended: 'true' }),
      api.getStats(),
    ]).then(([f, r, s]) => {
      setFeatured(f.stations || []);
      setRecommended(r.stations || []);
      setStats(s);
      setLoading(false);
    });
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl mb-8 p-8 md:p-12 bg-gradient-to-br from-orange-950/60 via-card to-card border border-border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-primary font-medium uppercase tracking-widest">Онлайн • В прямом эфире</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-3 text-foreground leading-tight">
            РАДИО<br />
            <span className="text-primary neon-text">РОССИЯ</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mb-6">
            Лучшие радиостанции страны — от поп-хитов до джаза. Слушайте бесплатно, без рекламы.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border">
              <Icon name="Radio" size={16} className="text-primary" />
              <span className="text-sm font-medium">{loading ? '—' : stats.total_stations} станций</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border">
              <Icon name="Music" size={16} className="text-primary" />
              <span className="text-sm font-medium">{loading ? '—' : stats.total_genres} жанров</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border">
              <Icon name="Wifi" size={16} className="text-primary" />
              <span className="text-sm font-medium">HD качество</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Star" size={18} className="text-primary" />
          <h2 className="font-display text-xl font-semibold uppercase tracking-wide">Популярные</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-secondary animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {featured.map((s, i) => (
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
      </section>

      {/* Recommended */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Zap" size={18} className="text-primary" />
          <h2 className="font-display text-xl font-semibold uppercase tracking-wide">Рекомендуем</h2>
        </div>
        {loading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-secondary animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recommended.map((s, i) => (
              <div key={s.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <StationCard
                  station={s}
                  isPlaying={currentStation?.id === s.id}
                  isFavorite={favorites.includes(s.id)}
                  onPlay={onPlay}
                  onFavorite={onFavorite}
                  compact
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
