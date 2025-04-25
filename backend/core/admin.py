from django.contrib import admin
from .models import UserProfile, RetroToken

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "tier")

@admin.register(RetroToken)
class RetroTokenAdmin(admin.ModelAdmin):
    list_display = ("user", "token", "used", "created_at")
