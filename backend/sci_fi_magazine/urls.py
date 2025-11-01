# backend/sci_fi_magazine/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),    # Admin panel
    path('api/', include('core.urls')), # API routes
    path('', include('core.urls')),     # Landing page at root "/"
]
