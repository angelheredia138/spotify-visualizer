from django.urls import path
from .views import spotify_auth, spotify_callback, top_genres, top_tracks, top_artists, recently_played

urlpatterns = [
    path('spotify-auth/', spotify_auth),
    path('spotify-callback/', spotify_callback),
    path('top-tracks/', top_tracks),
    path('top-artists/', top_artists),
    path('top-genres/', top_genres),
    path('recently-played/', recently_played),
]
