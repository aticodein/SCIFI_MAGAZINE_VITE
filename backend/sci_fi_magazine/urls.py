# backend/sci_fi_magazine/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
import os

urlpatterns = [
    path('admin/', admin.site.urls),    # Admin panel
    path('api/', include('core.urls')), # API routes
    path('', include('core.urls')),     # Landing page at root "/"
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Optional: allow serving media in production for simple deployments.
# Note: for real production reliability, prefer S3/Spaces (DJANGO_STORAGE_BACKEND=s3).
if (not settings.DEBUG) and (os.getenv("DJANGO_SERVE_MEDIA", "False") == "True"):
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
