import { useEffect, useState } from 'react';
import { api, Station } from '@/lib/api';
import { getSessionId } from '@/lib/session';
import RadioPlayer from '@/components/RadioPlayer';
import Home from './Home';
import Catalog from './Catalog';
import History from './History';
import Favorites from './Favorites';
import Support from './Support';
import Profile from './Profile';
import Admin from './Admin';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

type Page = 'home' | 'catalog' | 'history' | 'favorites' | 'support' | 'profile' | 'admin';

const navItems: { id: Page; label: string; icon: string; mobileLabel: string }[] = [
  { id: 'home', label: 'Главная', icon: 'Home', mobileLabel: 'Главная' },
  { id: 'catalog', label: 'Каталог', icon: 'Radio', mobileLabel: 'Каталог' },
  { id: 'history', label: 'История', icon: 'History', mobileLabel: 'История' },
  { id: 'favorites', label: 'Избранное', icon: 'Heart', mobileLabel: 'Избранное' },
  { id: 'support', label: 'Поддержать', icon: 'HandHeart', mobileLabel: 'Донат' },
  { id: 'profile', label: 'Профиль', icon: 'User', mobileLabel: 'Профиль' },
];

export default function Index() {
  const [page, setPage] = useState<Page>('home');
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoriteStations, setFavoriteStations] = useState<Station[]>([]);
  const [favLoading, setFavLoading] = useState(true);
  const sessionId = getSessionId();

  useEffect(() => {
    api.getFavorites(sessionId).then(r => {
      const favs: Station[] = r.favorites || [];
      setFavoriteStations(favs);
      setFavorites(favs.map((s: Station) => s.id));
      setFavLoading(false);
    });
  }, [sessionId]);

  const handlePlay = (station: Station) => {
    setCurrentStation(prev => prev?.id === station.id ? null : station);
    api.addHistory(sessionId, station.id, station.name, 0);
  };

  const handleFavorite = async (station: Station) => {
    const isFav = favorites.includes(station.id);
    if (isFav) {
      await api.toggleFavorite(sessionId, station.id, 'remove');
      setFavorites(prev => prev.filter(id => id !== station.id));
      setFavoriteStations(prev => prev.filter(s => s.id !== station.id));
    } else {
      await api.toggleFavorite(sessionId, station.id, 'add');
      setFavorites(prev => [...prev, station.id]);
      setFavoriteStations(prev => [...prev, station]);
    }
  };

  const isPlayerOpen = currentStation !== null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 fixed left-0 top-0 bottom-0 border-r border-border bg-sidebar z-40">
        {/* Logo */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
              <Icon name="Radio" size={18} />
            </div>
            <div>
              <div className="font-display font-bold text-sm leading-none">РадиоРоссии</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Онлайн радио</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3">
          <div className="flex flex-col gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full",
                  page === item.id
                    ? "bg-primary/15 text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
              >
                <Icon name={item.icon} size={17} fallback="Radio" />
                {item.label}
                {item.id === 'favorites' && favorites.length > 0 && (
                  <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold">
                    {favorites.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <button
              onClick={() => setPage('admin')}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full",
                page === 'admin'
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              <Icon name="Settings" size={17} />
              Админ-панель
            </button>
          </div>
        </nav>

        {/* Current station indicator in sidebar */}
        {currentStation && (
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex gap-0.5 items-end h-3 shrink-0">
                <span className="wave-bar h-2" />
                <span className="wave-bar h-3" />
                <span className="wave-bar h-2" />
              </div>
              <span className="text-xs font-medium text-primary truncate">{currentStation.name}</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className={cn(
        "flex-1 lg:ml-60 flex flex-col min-h-screen",
        isPlayerOpen ? "pb-20" : "pb-16 lg:pb-0"
      )}>
        {/* Top bar — mobile logo */}
        <header className="lg:hidden sticky top-0 z-30 glass border-b border-border px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Icon name="Radio" size={16} />
          </div>
          <span className="font-display font-bold text-sm">РадиоРоссии</span>
          <div className="ml-auto">
            <button
              onClick={() => setPage('admin')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                page === 'admin' ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon name="Settings" size={17} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {page === 'home' && (
            <Home currentStation={currentStation} favorites={favorites} onPlay={handlePlay} onFavorite={handleFavorite} />
          )}
          {page === 'catalog' && (
            <Catalog currentStation={currentStation} favorites={favorites} onPlay={handlePlay} onFavorite={handleFavorite} />
          )}
          {page === 'history' && (
            <History currentStation={currentStation} onPlay={handlePlay} />
          )}
          {page === 'favorites' && (
            <Favorites
              stations={favoriteStations}
              currentStation={currentStation}
              favorites={favorites}
              onPlay={handlePlay}
              onFavorite={handleFavorite}
              loading={favLoading}
            />
          )}
          {page === 'support' && <Support />}
          {page === 'profile' && <Profile />}
          {page === 'admin' && <Admin />}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-border">
        <div className={cn("flex", isPlayerOpen ? "mb-20" : "")}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 transition-colors",
                page === item.id ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon name={item.icon} size={20} fallback="Radio" />
                {item.id === 'favorites' && favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full text-[8px] text-primary-foreground flex items-center justify-center font-bold">
                    {favorites.length > 9 ? '9+' : favorites.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">{item.mobileLabel}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Radio Player */}
      <RadioPlayer station={currentStation} onClose={() => setCurrentStation(null)} />
    </div>
  );
}
