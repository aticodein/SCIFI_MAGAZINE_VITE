# backend/core/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('ping/', views.ping),
    path('token/redeem/', views.redeem_token),
    path('', views.landing_page, name='landing_page'),  # Serve landing page at "/api/"
]

