from django.shortcuts import render

# Create your views here.
from django.shortcuts import redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utils import update_or_create_user_tokens
from django.contrib.auth.models import User
import requests
import json
from django.conf import settings

SPOTIFY_CLIENT_ID = 'ecc927ddea8743b3af6b32d78a149e68'
SPOTIFY_CLIENT_SECRET = settings.SPOTIFY_CLIENT_SECRET
REDIRECT_URI = 'http://localhost:5173/callback'

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
def callback(request):
    data = json.loads(request.body)
    code = data.get('code')
    url = 'https://accounts.spotify.com/api/token'
    payload = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': SPOTIFY_CLIENT_ID,
        'client_secret': SPOTIFY_CLIENT_SECRET,
    }
    response = requests.post(url, data=payload)
    response_data = response.json()

    access_token = response_data.get('access_token')
    refresh_token = response_data.get('refresh_token')
    token_type = response_data.get('token_type')
    expires_in = response_data.get('expires_in')

    # For simplicity, assuming a single user
    user, created = User.objects.get_or_create(username='test_user')
    update_or_create_user_tokens(user, access_token, refresh_token, expires_in, token_type)

    return JsonResponse(response_data)
