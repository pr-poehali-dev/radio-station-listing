import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Основное API для радиостанций. Маршрутизация через параметр action."""
    
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id, X-Admin-Token',
        'Content-Type': 'application/json'
    }
    
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}
    
    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            pass
    
    # action — из query для GET, из body для POST/PUT
    action = params.get('action') or body.get('action', '')
    
    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # GET stations
        if method == 'GET' and action == 'stations':
            genre = params.get('genre')
            search = params.get('search', '').strip()
            featured = params.get('featured')
            recommended = params.get('recommended')
            
            query = "SELECT * FROM radio_stations WHERE is_active = true"
            args = []
            
            if genre:
                query += " AND genre = %s"
                args.append(genre)
            if search:
                query += " AND (name ILIKE %s OR description ILIKE %s OR city ILIKE %s)"
                args.extend([f'%{search}%', f'%{search}%', f'%{search}%'])
            if featured == 'true':
                query += " AND is_featured = true"
            if recommended == 'true':
                query += " AND is_recommended = true"
            
            query += " ORDER BY listeners_count DESC LIMIT 100"
            cur.execute(query, args)
            stations = [dict(r) for r in cur.fetchall()]
            return {'statusCode': 200, 'headers': cors_headers, 'body': json.dumps({'stations': stations}, default=str)}
        
        # GET genres
        if method == 'GET' and action == 'genres':
            cur.execute("SELECT DISTINCT genre FROM radio_stations WHERE is_active = true AND genre IS NOT NULL ORDER BY genre")
            genres = [r['genre'] for r in cur.fetchall()]
            return {'statusCode': 200, 'headers': cors_headers, 'body': json.dumps({'genres': genres})}
        
        # GET stats
        if method == 'GET' and action == 'stats':
            session_id = params.get('session_id')
            cur.execute("SELECT COUNT(*) as total FROM radio_stations WHERE is_active = true")
            total_stations = cur.fetchone()['total']
            cur.execute("SELECT COUNT(DISTINCT genre) as genres FROM radio_stations WHERE is_active = true")
            total_genres = cur.fetchone()['genres']
            user_listened = 0
            user_favorites = 0
            if session_id:
                cur.execute("SELECT COUNT(DISTINCT station_id) as cnt FROM listen_history WHERE session_id = %s", (session_id,))
                user_listened = cur.fetchone()['cnt']
                cur.execute("SELECT COUNT(*) as cnt FROM favorites WHERE session_id = %s", (session_id,))
                user_favorites = cur.fetchone()['cnt']
            return {'statusCode': 200, 'headers': cors_headers, 'body': json.dumps({
                'total_stations': total_stations,
                'total_genres': total_genres,
                'user_listened': user_listened,
                'user_favorites': user_favorites
            })}
        
        # GET history
        if method == 'GET' and action == 'history':
            session_id = params.get('session_id')
            if not session_id:
                return {'statusCode': 400, 'headers': cors_headers, 'body': json.dumps({'error': 'session_id required'})}
            cur.execute("""
                SELECT lh.id, lh.station_id, lh.station_name, lh.listened_at, lh.duration_seconds,
                       rs.name as current_name, rs.genre, rs.logo_url, rs.stream_url
                FROM listen_history lh
                LEFT JOIN radio_stations rs ON rs.id = lh.station_id
                WHERE lh.session_id = %s
                ORDER BY lh.listened_at DESC LIMIT 100
            """, (session_id,))
            history = [dict(r) for r in cur.fetchall()]
            return {'statusCode': 200, 'headers': cors_headers, 'body': json.dumps({'history': history}, default=str)}
        
        # GET favorites
        if method == 'GET' and action == 'favorites':
            session_id = params.get('session_id')
            if not session_id:
                return {'statusCode': 400, 'headers': cors_headers, 'body': json.dumps({'error': 'session_id required'})}
            cur.execute("""
                SELECT rs.*, f.created_at as favorited_at
                FROM favorites f
                JOIN radio_stations rs ON rs.id = f.station_id
                WHERE f.session_id = %s ORDER BY f.created_at DESC
            """, (session_id,))
            favorites = [dict(r) for r in cur.fetchall()]
            return {'statusCode': 200, 'headers': cors_headers, 'body': json.dumps({'favorites': favorites}, default=str)}
        
        # POST history
        if method == 'POST' and action == 'history':
            session_id = body.get('session_id')
            station_id = body.get('station_id')
            station_name = body.get('station_name', '')
            duration = body.get('duration_seconds', 0)
            if not session_id or not station_id:
                return {'statusCode': 400, 'headers': cors_headers, 'body': json.dumps({'error': 'session_id and station_id required'})}
            cur.execute(
                "INSERT INTO listen_history (session_id, station_id, station_name, duration_seconds) VALUES (%s, %s, %s, %s)",
                (session_id, station_id, station_name, duration)
            )
            conn.commit()
            return {'statusCode': 200, 'headers': cors_headers, 'body': json.dumps({'success': True})}
        
        # POST favorites (add/remove)
        if method == 'POST' and action == 'favorites':
            session_id = body.get('session_id')
            station_id = body.get('station_id')
            fav_action = body.get('fav_action', 'add')
            if not session_id or not station_id:
                return {'statusCode': 400, 'headers': cors_headers, 'body': json.dumps({'error': 'session_id and station_id required'})}
            if fav_action == 'add':
                cur.execute(
                    "INSERT INTO favorites (session_id, station_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                    (session_id, station_id)
                )
                conn.commit()
                return {'statusCode': 200, 'headers': cors_headers, 'body': json.dumps({'success': True, 'action': 'added'})}
            else:
                cur.execute(
                    "SELECT id FROM favorites WHERE session_id = %s AND station_id = %s",
                    (session_id, station_id)
                )
                row = cur.fetchone()
                if row:
                    cur.execute("UPDATE favorites SET created_at = NOW() WHERE id = %s AND 1=0", (row['id'],))
                    # Используем UPDATE вместо DELETE (политика БД)
                    cur.execute("UPDATE favorites SET session_id = 'deleted_' || session_id WHERE session_id = %s AND station_id = %s", (session_id, station_id))
                conn.commit()
                return {'statusCode': 200, 'headers': cors_headers, 'body': json.dumps({'success': True, 'action': 'removed'})}
        
        # ADMIN: GET all stations
        if method == 'GET' and action == 'admin_stations':
            admin_token = (event.get('headers') or {}).get('x-admin-token', '')
            if admin_token != 'admin123':
                return {'statusCode': 403, 'headers': cors_headers, 'body': json.dumps({'error': 'Forbidden'})}
            cur.execute("SELECT * FROM radio_stations ORDER BY created_at DESC")
            stations = [dict(r) for r in cur.fetchall()]
            return {'statusCode': 200, 'headers': cors_headers, 'body': json.dumps({'stations': stations}, default=str)}
        
        # ADMIN: POST add station
        if method == 'POST' and action == 'admin_add':
            admin_token = (event.get('headers') or {}).get('x-admin-token', '')
            if admin_token != 'admin123':
                return {'statusCode': 403, 'headers': cors_headers, 'body': json.dumps({'error': 'Forbidden'})}
            cur.execute("""
                INSERT INTO radio_stations (name, genre, description, stream_url, logo_url, city, frequency, is_active, is_featured, is_recommended, listeners_count)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *
            """, (
                body.get('name'), body.get('genre'), body.get('description'),
                body.get('stream_url'), body.get('logo_url'), body.get('city'),
                body.get('frequency'), body.get('is_active', True),
                body.get('is_featured', False), body.get('is_recommended', False),
                body.get('listeners_count', 0)
            ))
            station = dict(cur.fetchone())
            conn.commit()
            return {'statusCode': 200, 'headers': cors_headers, 'body': json.dumps({'station': station}, default=str)}
        
        # ADMIN: POST update station
        if method == 'POST' and action == 'admin_update':
            admin_token = (event.get('headers') or {}).get('x-admin-token', '')
            if admin_token != 'admin123':
                return {'statusCode': 403, 'headers': cors_headers, 'body': json.dumps({'error': 'Forbidden'})}
            station_id = body.get('id')
            cur.execute("""
                UPDATE radio_stations SET
                    name = COALESCE(%s, name),
                    genre = COALESCE(%s, genre),
                    description = COALESCE(%s, description),
                    stream_url = COALESCE(%s, stream_url),
                    logo_url = COALESCE(%s, logo_url),
                    city = COALESCE(%s, city),
                    frequency = COALESCE(%s, frequency),
                    is_active = COALESCE(%s, is_active),
                    is_featured = COALESCE(%s, is_featured),
                    is_recommended = COALESCE(%s, is_recommended),
                    listeners_count = COALESCE(%s, listeners_count),
                    updated_at = NOW()
                WHERE id = %s RETURNING *
            """, (
                body.get('name'), body.get('genre'), body.get('description'),
                body.get('stream_url'), body.get('logo_url'), body.get('city'),
                body.get('frequency'), body.get('is_active'), body.get('is_featured'),
                body.get('is_recommended'), body.get('listeners_count'), station_id
            ))
            station = cur.fetchone()
            conn.commit()
            if station:
                return {'statusCode': 200, 'headers': cors_headers, 'body': json.dumps({'station': dict(station)}, default=str)}
            return {'statusCode': 404, 'headers': cors_headers, 'body': json.dumps({'error': 'Not found'})}
        
        return {'statusCode': 404, 'headers': cors_headers, 'body': json.dumps({'error': 'Unknown action', 'action': action})}
    
    finally:
        cur.close()
        conn.close()
