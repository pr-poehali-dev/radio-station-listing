
CREATE TABLE IF NOT EXISTS radio_stations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  description TEXT,
  stream_url TEXT NOT NULL,
  logo_url TEXT,
  city VARCHAR(100),
  frequency VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_recommended BOOLEAN DEFAULT false,
  listeners_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS listen_history (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  station_id INTEGER REFERENCES radio_stations(id),
  station_name VARCHAR(255),
  listened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_seconds INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  station_id INTEGER REFERENCES radio_stations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, station_id)
);

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
