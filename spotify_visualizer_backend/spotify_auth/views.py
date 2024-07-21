import os
import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
import logging
from django.views.decorators.csrf import csrf_exempt

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
