from django.shortcuts import redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utils import update_or_create_user_tokens
from django.contrib.auth.models import User
import requests
import json
from django.conf import settings

SPOTIFY_CLIENT_ID = settings.SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET = settings.SPOTIFY_CLIENT_SECRET
REDIRECT_URI = 'http://localhost:5173/callback'  # Change this to your frontend callback URL

def spotify_login(request):
    scopes = 'user-read-recently-played user-top-read'
    url = 'https://accounts.spotify.com/authorize'
    params = {
        'client_id': SPOTIFY_CLIENT_ID,
        'response_type': 'code',
        'redirect_uri': REDIRECT_URI,
        'scope': scopes,
    }
    response = requests.get(url, params=params)
    return redirect(response.url)

@csrf_exempt
def spotify_callback(request):
    code = request.POST.get('code')
    redirect_uri = 'http://localhost:3000/callback'

    payload = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri,
        'client_id': settings.SPOTIFY_CLIENT_ID,
        'client_secret': settings.SPOTIFY_CLIENT_SECRET,
    }

    response = requests.post('https://accounts.spotify.com/api/token', data=payload)
    return JsonResponse(response.json())