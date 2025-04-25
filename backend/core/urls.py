from django.urls import path
from . import views

urlpatterns = [
    path('ping/', views.ping),
    path("token/redeem/", views.redeem_token),
]
