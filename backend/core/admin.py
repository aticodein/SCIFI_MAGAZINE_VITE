from django.contrib import admin
from .models import UserProfile, RetroToken
from .models import UserMiningProgress

@admin.register(UserMiningProgress)
class UserMiningProgressAdmin(admin.ModelAdmin):
    list_display = ('username', 'created_at')  # adjust fields you want to see

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "tier")

@admin.register(RetroToken)
class RetroTokenAdmin(admin.ModelAdmin):
    list_display = ("user", "token", "used", "created_at")
