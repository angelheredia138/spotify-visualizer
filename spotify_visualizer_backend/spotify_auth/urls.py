from django.urls import path
from .views import spotify_callback

urlpatterns = [
    path('spotify-callback/', spotify_callback, name='spotify-callback'),  # Correct path
]
