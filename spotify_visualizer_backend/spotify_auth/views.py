import os
import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
import logging
from django.views.decorators.csrf import csrf_exempt
from .utils import get_spotify_access_token

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

    time_range = request.GET.get('time_range', 'medium_term')
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