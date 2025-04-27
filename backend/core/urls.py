# backend/core/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('ping/', views.ping),
    path('token/redeem/', views.redeem_token),
    path('create-username/', views.create_username, name='create-username'),  # <-- no "api/" here
    path('check-username/', views.check_username, name='check_username'),      # <-- no "api/" here
    path('', views.landing_page, name='landing_page'),
    path('logout/', views.logout_view, name='logout'),
]


