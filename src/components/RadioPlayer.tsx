import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Station } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Props {
  station: Station | null;
  onClose: () => void;
}

export default function RadioPlayer({ station, onClose }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!station || !audioRef.current) return;
    const audio = audioRef.current;
    audio.src = station.stream_url;
    audio.volume = volume;
    setError(false);
    setLoading(true);
    audio.play().then(() => {
      setPlaying(true);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      setError(true);
    });
    return () => {
      audio.pause();
      audio.src = '';
      setPlaying(false);
    };
  }, [station]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      setLoading(true);
      audioRef.current.play().then(() => {
        setPlaying(true);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
        setError(true);
      });
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  if (!station) return null;

  const genreEmoji: Record<string, string> = {
    'Поп': '🎵', 'Рок': '🎸', 'Джаз': '🎷', 'Электронная': '🎛️',
    'Русская попса': '🎤', 'Разнообразная': '🎶', 'Новости/Разговорное': '📻',
    'Поп/Рок': '🎸',
  };
  const emoji = genreEmoji[station.genre] || '📻';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
      <audio
        ref={audioRef}
        onError={() => { setError(true); setLoading(false); }}
        onWaiting={() => setLoading(true)}
        onPlaying={() => { setLoading(false); setError(false); }}
      />
      <div className="max-w-screen-xl mx-auto px-4 h-20 flex items-center gap-4">
        {/* Station info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 bg-secondary border border-border",
            playing && !error && "neon-glow animate-pulse-ring"
          )}>
            {station.logo_url
              ? <img src={station.logo_url} className="w-full h-full object-cover rounded-xl" alt="" />
              : emoji}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate text-foreground">{station.name}</div>
            <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
              {error ? (
                <span className="text-destructive">Ошибка подключения</span>
              ) : loading ? (
                <span className="text-primary">Подключение...</span>
              ) : playing ? (
                <span className="flex items-center gap-1.5 text-primary">
                  <span className="flex gap-0.5 items-end h-3">
                    <span className="wave-bar h-2" />
                    <span className="wave-bar h-3" />
                    <span className="wave-bar h-2.5" />
                    <span className="wave-bar h-3" />
                  </span>
                  В эфире
                </span>
              ) : (
                <span>{station.genre} · {station.city}</span>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            disabled={loading}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0",
              "bg-primary text-primary-foreground hover:opacity-90 active:scale-95",
              loading && "opacity-60"
            )}
          >
            {loading ? (
              <Icon name="Loader2" size={20} className="animate-spin" />
            ) : playing ? (
              <Icon name="Pause" size={20} />
            ) : (
              <Icon name="Play" size={20} className="ml-0.5" />
            )}
          </button>
        </div>

        {/* Volume */}
        <div className="hidden sm:flex items-center gap-2 w-32">
          <Icon name="Volume2" size={16} className="text-muted-foreground shrink-0" />
          <input
            type="range" min="0" max="1" step="0.05"
            value={volume}
            onChange={handleVolume}
            className="w-full accent-orange-500 h-1 cursor-pointer"
          />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0"
        >
          <Icon name="X" size={18} />
        </button>
      </div>
    </div>
  );
}
