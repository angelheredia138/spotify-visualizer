from django.urls import path
from .views import spotify_auth, spotify_callback

urlpatterns = [
    path('spotify-auth/', spotify_auth),
    path('spotify-callback/', spotify_callback),
]
