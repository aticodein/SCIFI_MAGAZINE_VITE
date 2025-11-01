# backend/sci_fi_magazine/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static

def favicon_view(request):
    """Return a simple favicon response to prevent 404 errors"""
    return HttpResponse(status=204)  # No Content response

urlpatterns = [
    path('admin/', admin.site.urls),    # Admin panel
    path('api/', include('core.urls')), # API routes
    path('favicon.ico', favicon_view, name='favicon'),  # Handle favicon requests
    path('', include('core.urls')),     # Landing page at root "/"
]

# Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
