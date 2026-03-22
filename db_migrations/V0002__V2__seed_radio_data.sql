
INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Европа Плюс', 'Поп', 'Популярная музыка и хиты со всего мира', 'https://europaplus.hostingradio.ru:8200/europaplus192.mp3', NULL, 'Москва', '106.2 FM', true, true, true, 54200
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Европа Плюс');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Авторадио', 'Поп/Рок', 'Лучшая музыка для путешествий', 'https://avtoradio.hostingradio.ru:8200/avtoradio192.mp3', NULL, 'Москва', '90.3 FM', true, true, false, 38100
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Авторадио');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Русское Радио', 'Русская попса', 'Только русская музыка — лучшие хиты', 'https://rusradio.hostingradio.ru/rusradio96.aac', NULL, 'Москва', '105.7 FM', true, false, true, 47500
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Русское Радио');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Rock FM', 'Рок', 'Классический и современный рок', 'https://rockfm.hostingradio.ru/rockfm96.aac', NULL, 'Москва', '95.2 FM', true, true, false, 21300
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Rock FM');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'DFM', 'Электронная', 'Электронная и клубная музыка', 'https://dfm.hostingradio.ru/dfm96.aac', NULL, 'Москва', '101.2 FM', true, false, true, 18700
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'DFM');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Маяк', 'Разнообразная', 'Главная информационная радиостанция России', 'https://icecast.vgtrk.cdnvideo.ru/mayak_mp3_192kbps', NULL, 'Москва', '103.4 FM', true, false, false, 15200
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Маяк');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Вести FM', 'Новости/Разговорное', 'Новости и аналитика 24/7', 'https://icecast.vgtrk.cdnvideo.ru/vestifm_mp3_192kbps', NULL, 'Москва', '97.6 FM', true, false, false, 12400
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Вести FM');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Юмор FM', 'Разнообразная', 'Музыка и юмор в эфире', 'https://humor.hostingradio.ru/humor96.aac', NULL, 'Москва', '98.6 FM', true, false, true, 24600
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Юмор FM');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Радио Jazz', 'Джаз', 'Лучший джаз круглосуточно', 'https://jazz.hostingradio.ru/jazz96.aac', NULL, 'Москва', '89.1 FM', true, false, false, 8900
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Радио Jazz');

INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
SELECT 'Energy', 'Электронная', 'Лучшая танцевальная музыка', 'https://pub0302.101.ru:8000/stream/pro/aac/64/101', NULL, 'Москва', '104.2 FM', true, true, true, 31200
WHERE NOT EXISTS (SELECT 1 FROM radio_stations WHERE name = 'Energy');

INSERT INTO admin_users (username, password_hash)
SELECT 'admin', 'admin123'
WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'admin');
