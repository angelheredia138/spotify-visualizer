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
    get_wrapped_data,
    get_total_listening_time,
    get_unique_artists,
    get_unique_genres,
    get_trends_insights,
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
    path('wrapped/', get_wrapped_data, name='get_wrapped_data'),
    path('total_listening_time/', get_total_listening_time, name='get_total_listening_time'),    path('unique_genres/', get_unique_genres, name='get_unique_genres'),
    path('unique_artists/', get_unique_artists, name='get_unique_artists'),
    path('trends_insights/', get_trends_insights, name='get_trends_insights'),
]
