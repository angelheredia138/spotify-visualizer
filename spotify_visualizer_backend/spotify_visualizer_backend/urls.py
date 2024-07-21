from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('spotify_auth.urls')),  # Ensure you are including the correct app's URLs
]
