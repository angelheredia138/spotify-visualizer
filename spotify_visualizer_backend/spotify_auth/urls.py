from django.urls import path
from .views import (
    spotify_auth,
    spotify_callback,
    top_genres,
    top_tracks,
    top_artists,
    recently_played,
    get_genres,
    get_playlists,
    top_songs,
    listening_habits,
    listening_time
)

urlpatterns = [
    path('spotify-auth/', spotify_auth),
    path('spotify-callback/', spotify_callback),
    path('top-tracks/', top_tracks),
    path('top-artists/', top_artists),
    path('top-genres/', top_genres),
    path('recently-played/', recently_played),
    path('genres/', get_genres, name='get_genres'),
    path('playlists/', get_playlists, name='get_playlists'),
    path('top-songs/', top_songs, name='top_songs'),
    path('listening-habits/', listening_habits, name='listening_habits'),
    path('listening-time/', listening_time, name='listening_time'),
]
