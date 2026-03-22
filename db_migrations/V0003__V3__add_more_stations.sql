
INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Радио 1', 'Поп', 'Лучшие хиты 80-х, 90-х и 2000-х', 'https://radio1.hostingradio.ru/radio196.aac', NULL, 'Москва', '107.0 FM', true, false, true, 19500
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Радио 1');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Монте-Карло', 'Джаз/Lounge', 'Джаз, лаундж и мягкая электроника', 'https://montecarlo.hostingradio.ru/montecarlo96.aac', NULL, 'Москва', '102.1 FM', true, true, false, 14200
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Монте-Карло');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Наше Радио', 'Рок', 'Русский рок — классика и новинки', 'https://nashe.hostingradio.ru/nashe96.aac', NULL, 'Москва', '101.7 FM', true, true, true, 33100
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Наше Радио');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Ретро FM', 'Ретро', 'Хиты прошлых десятилетий', 'https://retro.hostingradio.ru/retro96.aac', NULL, 'Москва', '88.0 FM', true, false, true, 28700
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Ретро FM');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Love Radio', 'Поп', 'Музыка о любви 24 часа', 'https://loveradio.hostingradio.ru/loveradio96.aac', NULL, 'Москва', '106.7 FM', true, false, false, 22400
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Love Radio');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Радио Шансон', 'Шансон', 'Русский шансон и авторская песня', 'https://shanson.hostingradio.ru/shanson96.aac', NULL, 'Москва', '103.0 FM', true, false, false, 31600
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Радио Шансон');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Детское радио', 'Детская', 'Музыка и сказки для детей', 'https://detradioru.hostingradio.ru/detradio96.aac', NULL, 'Москва', '90.1 FM', true, false, true, 11200
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Детское радио');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Business FM', 'Новости/Разговорное', 'Деловые новости и аналитика', 'https://bfm.hostingradio.ru/bfm96.aac', NULL, 'Москва', '87.5 FM', true, false, false, 9800
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Business FM');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Эхо Москвы', 'Новости/Разговорное', 'Информационное радио', 'https://echo.hostingradio.ru/echo96.aac', NULL, 'Москва', '91.2 FM', true, false, false, 17300
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Эхо Москвы');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Дорожное радио', 'Поп/Рок', 'Музыка для дороги', 'https://dorognoe.hostingradio.ru/dorognoe96.aac', NULL, 'Санкт-Петербург', '96.0 FM', true, false, true, 26500
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Дорожное радио');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Хит FM', 'Поп', 'Лучшие поп-хиты России и мира', 'https://hitfm.hostingradio.ru/hitfm96.aac', NULL, 'Москва', '107.4 FM', true, true, false, 29100
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Хит FM');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Радио Классика', 'Классическая', 'Классическая музыка всех эпох', 'https://classic.hostingradio.ru/classic96.aac', NULL, 'Москва', '100.9 FM', true, false, false, 7600
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Радио Классика');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Серебряный дождь', 'Разнообразная', 'Авторские программы и хорошая музыка', 'https://silver.hostingradio.ru/silver96.aac', NULL, 'Москва', '100.1 FM', true, false, true, 13800
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Серебряный дождь');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Питер FM', 'Поп', 'Радио Санкт-Петербурга', 'https://piterfm.hostingradio.ru/piterfm96.aac', NULL, 'Санкт-Петербург', '107.4 FM', true, false, false, 16400
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Питер FM');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Maximum', 'Рок', 'Рок и альтернатива без остановок', 'https://maximum.hostingradio.ru/maximum96.aac', NULL, 'Москва', '103.7 FM', true, true, false, 18900
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Maximum');
