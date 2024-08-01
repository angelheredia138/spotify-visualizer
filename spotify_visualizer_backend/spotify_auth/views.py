import os
import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
import logging
from django.views.decorators.csrf import csrf_exempt
from .utils import get_spotify_access_token
import datetime

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@api_view(['GET'])
def spotify_auth(request):
    auth_url = (
        f"https://accounts.spotify.com/authorize"
        f"?client_id={settings.SPOTIFY_CLIENT_ID}"
        f"&response_type=code"
        f"&redirect_uri={settings.SPOTIFY_REDIRECT_URI}"
        f"&scope=user-modify-playback-state user-read-recently-played user-top-read"
    )
    return Response({'auth_url': auth_url})

@api_view(['GET'])
def spotify_callback(request):
    code = request.GET.get('code')
    if not code:
        return JsonResponse({'error': 'Authorization code not provided'}, status=400)

    token_url = "https://accounts.spotify.com/api/token"
    response = requests.post(token_url, data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': settings.SPOTIFY_REDIRECT_URI,
        'client_id': settings.SPOTIFY_CLIENT_ID,
        'client_secret': settings.SPOTIFY_CLIENT_SECRET,
    })
    if response.status_code != 200:
        logger.error(f"Error during token exchange: {response.content}")
        return JsonResponse({'error': 'Token exchange failed'}, status=400)

    tokens = response.json()
    access_token = tokens.get('access_token')
    refresh_token = tokens.get('refresh_token')

    # Store the refresh token securely
    with open('refresh_token.txt', 'w') as f:
        f.write(refresh_token)

    return JsonResponse({'access_token': access_token, 'refresh_token': refresh_token})

@api_view(['GET'])
def top_tracks(request):
    token = get_spotify_access_token()
    if token is None:
        return JsonResponse({'error': 'Token not available'}, status=400)

    time_range = request.GET.get('time_range', 'medium_term')
    url = f"https://api.spotify.com/v1/me/top/tracks?time_range={time_range}&limit=40"

    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return JsonResponse({'error': 'Failed to fetch top tracks'}, status=response.status_code)

    return JsonResponse(response.json())

@api_view(['GET'])
def top_artists(request):
    token = get_spotify_access_token()
    if token is None:
        return JsonResponse({'error': 'Token not available'}, status=400)

    time_range = request.GET.get('time_range', 'short_term')
    url = f"https://api.spotify.com/v1/me/top/artists?time_range={time_range}&limit=10"

    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return JsonResponse({'error': 'Failed to fetch top artists'}, status=response.status_code)

    return JsonResponse(response.json())

@api_view(['GET'])
def top_genres(request):
    token = get_spotify_access_token()
    if token is None:
        return JsonResponse({'error': 'Token not available'}, status=400)

    time_range = request.GET.get('time_range', 'medium_term')  # default to medium_term
    url = f"https://api.spotify.com/v1/me/top/artists?time_range={time_range}&limit=50"

    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return JsonResponse({'error': 'Failed to fetch top genres'}, status=response.status_code)

    artists = response.json().get('items', [])
    genres = {}
    for artist in artists:
        for genre in artist.get('genres', []):
            if genre in genres:
                genres[genre]['count'] += 1
                genres[genre]['artists'].append(artist['name'])
            else:
                genres[genre] = {'count': 1, 'artists': [artist['name']]}

    genres_list = [{'genre': genre, 'count': data['count'], 'artists': data['artists']} for genre, data in genres.items()]
    top_genres = sorted(genres_list, key=lambda x: x['count'], reverse=True)[:10]
    least_genres = [genre for genre in genres_list if genre not in top_genres]

    return JsonResponse({'top_genres': top_genres, 'least_genres': least_genres})

@api_view(['GET'])
def recently_played(request):
    token = request.headers.get('Authorization').split(' ')[1]
    url = 'https://api.spotify.com/v1/me/player/recently-played?limit=50'
    headers = {
        'Authorization': f'Bearer {token}'
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return JsonResponse(response.json(), safe=False)
    else:
        return JsonResponse({'error': 'Failed to fetch data'}, status=response.status_code)

@api_view(['GET'])
def get_genres(request):
    token = request.headers.get('Authorization').split(' ')[1]  # Extract the token from the Authorization header
    url = "https://api.spotify.com/v1/me/top/artists"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        genres = [genre for artist in data['items'] for genre in artist['genres']]
        genre_counts = {genre: genres.count(genre) for genre in set(genres)}
        sorted_genres = sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)
        genres_list = [{'genre': genre, 'count': count} for genre, count in sorted_genres]
        return JsonResponse({'genres': genres_list})
    else:
        return JsonResponse({'error': 'Failed to fetch genres from Spotify'}, status=500)

@api_view(['GET'])
def get_playlists(request):
    token = get_spotify_access_token()
    if token is None:
        return JsonResponse({'error': 'Token not available'}, status=400)

    url = "https://api.spotify.com/v1/me/playlists?limit=50"
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        return JsonResponse({'error': 'Failed to fetch playlists'}, status=response.status_code)

    playlists = response.json().get('items', [])
    playlist_data = []

    for playlist in playlists:
        playlist_id = playlist.get('id')
        playlist_name = playlist.get('name')
        tracks_url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
        tracks_response = requests.get(tracks_url, headers=headers)

        if tracks_response.status_code == 200:
            tracks = tracks_response.json().get('items', [])
            artists = set()
            for item in tracks:
                track = item.get('track')
                if track:
                    for artist in track.get('artists', []):
                        artists.add(artist.get('name'))

            playlist_data.append({
                'id': playlist_id,
                'name': playlist_name,
                'artists': list(artists)
            })

    return JsonResponse({'playlists': playlist_data})

@api_view(['GET'])
def get_wrapped_data(request):
    token = request.headers.get('Authorization').split()[1]
    headers = {
        'Authorization': f'Bearer {token}'
    }

    # Fetch top artist
    top_artist_response = requests.get('https://api.spotify.com/v1/me/top/artists?limit=1&time_range=long_term', headers=headers)
    top_artist = top_artist_response.json().get('items', [])[0] if top_artist_response.status_code == 200 else None

    # Fetch top track
    top_track_response = requests.get('https://api.spotify.com/v1/me/top/tracks?limit=1&time_range=long_term', headers=headers)
    top_track = top_track_response.json().get('items', [])[0] if top_track_response.status_code == 200 else None

    # Fetch top genres from top artists
    genres_response = requests.get('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term', headers=headers)
    if genres_response.status_code == 200:
        artists = genres_response.json().get('items', [])
        genres = {}
        for artist in artists:
            for genre in artist.get('genres', []):
                if genre in genres:
                    genres[genre] += 1
                else:
                    genres[genre] = 1
        top_genre = max(genres, key=genres.get) if genres else None
    else:
        top_genre = None

    # Fetch top 5 artists
    top_artists_response = requests.get('https://api.spotify.com/v1/me/top/artists?limit=5&time_range=long_term', headers=headers)
    if top_artists_response.status_code == 200:
        top_artists = top_artists_response.json().get('items', [])
        top_artists_data = [{
            'name': artist['name'],
            'image': artist['images'][0]['url'] if artist.get('images') else '',
            'playcount': artist['popularity']  # Spotify does not provide play count directly
        } for artist in top_artists]
    else:
        top_artists_data = []

    # Fetch recently played tracks to calculate total listening time and unique artists
    recent_tracks_response = requests.get('https://api.spotify.com/v1/me/player/recently-played?limit=50', headers=headers)
    if recent_tracks_response.status_code == 200:
        recent_tracks = recent_tracks_response.json().get('items', [])
        total_listening_time = sum([item['track']['duration_ms'] for item in recent_tracks]) // (1000 * 60 * 60)  # convert ms to hours
        unique_artists = len(set([artist['id'] for item in recent_tracks for artist in item['track']['artists']]))
        unique_genres = len(set([genre for artist in artists for genre in artist.get('genres', [])]))
    else:
        total_listening_time = 0
        unique_artists = 0
        unique_genres = 0

    # Calculate trends and insights
    # Example trends: Most popular genre, most active listening time, etc.
    trends = f"Your top genre is {top_genre}. You love listening to music in the evenings!"

    # Combine data into one response
    wrapped_data = {
        'top_artist': {
            'name': top_artist['name'],
            'image': top_artist['images'][0]['url'] if top_artist and top_artist.get('images') else '',
        } if top_artist else None,
        'top_track': {
            'title': top_track['name'],
            'artist': top_track['artists'][0]['name'] if top_track and top_track.get('artists') else '',
        } if top_track else None,
        'top_genre': top_genre,
        'top_artists': top_artists_data,
        'listening_time': total_listening_time,
        'unique_genres': unique_genres,
        'unique_artists': unique_artists,
        'trends': trends
    }

    return JsonResponse(wrapped_data)

@api_view(['GET'])
def get_total_listening_time(request):
    token = get_spotify_access_token()
    headers = {
        'Authorization': f'Bearer {token}'
    }

    total_listening_time = 0
    last_month = (datetime.datetime.now() - datetime.timedelta(days=30)).timestamp() * 1000  # Convert to milliseconds

    url = f'https://api.spotify.com/v1/me/player/recently-played?limit=50&after={int(last_month)}'
    while url:
        recent_tracks_response = requests.get(url, headers=headers)
        if recent_tracks_response.status_code == 200:
            recent_tracks = recent_tracks_response.json()
            total_listening_time += sum([item['track']['duration_ms'] for item in recent_tracks.get('items', [])]) // (1000 * 60 * 60)  # convert ms to hours
            url = recent_tracks.get('next')  # get the next page URL
        else:
            url = None

    return JsonResponse({'total_listening_time': total_listening_time})

@api_view(['GET'])
def get_unique_genres(request):
    token = get_spotify_access_token()
    headers = {
        'Authorization': f'Bearer {token}'
    }

    # Fetch top artists to gather genres
    genres_response = requests.get('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term', headers=headers)
    if genres_response.status_code == 200:
        artists = genres_response.json().get('items', [])
        unique_genres = len(set([genre for artist in artists for genre in artist.get('genres', [])]))
    else:
        unique_genres = 0

    return JsonResponse({'unique_genres': unique_genres})

@api_view(['GET'])
def get_unique_artists(request):
    token = get_spotify_access_token()
    headers = {
        'Authorization': f'Bearer {token}'
    }

    # Fetch top artists for unique artist count
    artists_response = requests.get('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term', headers=headers)
    if artists_response.status_code == 200:
        artists = artists_response.json().get('items', [])
        unique_artists = len(artists)
    else:
        unique_artists = 0

    return JsonResponse({'unique_artists': unique_artists})

@api_view(['GET'])
def get_trends_insights(request):
    token = get_spotify_access_token()
    headers = {
        'Authorization': f'Bearer {token}'
    }

    # Fetch recently played tracks for the last month to analyze listening patterns
    last_month = (datetime.datetime.now() - datetime.timedelta(days=30)).timestamp() * 1000  # Convert to milliseconds
    url = f'https://api.spotify.com/v1/me/player/recently-played?limit=50&after={int(last_month)}'

    listening_times = []

    while url:
        recent_tracks_response = requests.get(url, headers=headers)
        if recent_tracks_response.status_code == 200:
            recent_tracks = recent_tracks_response.json()
            listening_times.extend([item['played_at'] for item in recent_tracks.get('items', [])])
            url = recent_tracks.get('next')  # get the next page URL
        else:
            url = None

    # Analyze listening times to find the most active listening period
    if listening_times:
        hours = [datetime.datetime.fromisoformat(time.replace('Z', '+00:00')).hour for time in listening_times]
        most_active_hour = max(set(hours), key=hours.count)

        # Convert hour to time of day
        if 5 <= most_active_hour < 12:
            time_of_day = "morning"
        elif 12 <= most_active_hour < 17:
            time_of_day = "afternoon"
        elif 17 <= most_active_hour < 21:
            time_of_day = "evening"
        else:
            time_of_day = "night"
        
        trends = f"You most frequently listen to music in the {time_of_day}."
    else:
        trends = "We couldn't determine your most active listening period."

    # Fetch top genres
    genres_response = requests.get('https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term', headers=headers)
    if genres_response.status_code == 200:
        artists = genres_response.json().get('items', [])
        genres = {}
        for artist in artists:
            for genre in artist.get('genres', []):
                if genre in genres:
                    genres[genre] += 1
                else:
                    genres[genre] = 1
        top_genre = max(genres, key=genres.get) if genres else None
    else:
        top_genre = None

    trends += f" Your top genre is {top_genre}."

    return JsonResponse({'trends': trends})
