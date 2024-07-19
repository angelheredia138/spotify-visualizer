from django.urls import path
from .views import spotify_login, callback

urlpatterns = [
    path('login/', spotify_login, name='spotify-login'),
    path('callback/', callback, name='spotify-callback'),
]
