# core/models.py

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
# models.py

class UserMiningProgress(models.Model):
    username = models.CharField(max_length=150, unique=True)
    # PRODUCTION HOTFIX: These fields are temporarily commented out
    # until Railway database migrations are run
    # code_A = models.CharField(max_length=6, null=True, blank=True)  # 🚀
    # code_B = models.CharField(max_length=6, null=True, blank=True)  # 🚀
    # code_C = models.CharField(max_length=6, null=True, blank=True)  # 🚀
    # code_D = models.CharField(max_length=6, null=True, blank=True)  # 🚀
    # code_E = models.CharField(max_length=6, null=True, blank=True)  # 🚀
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    tier = models.PositiveIntegerField(default=1)  # Paid or current level

    def get_effective_tier(self):
        active_tokens = RedeemedToken.objects.filter(
            user=self.user,
            expires_at__gt=timezone.now()
        ).order_by('-tier_granted')
        if active_tokens.exists():
            return max(self.tier, active_tokens.first().tier_granted)
        return self.tier

    def __str__(self):
        return f"{self.user.username} (Tier {self.get_effective_tier()})"


class RetroToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  # <-- updated
    token = models.CharField(max_length=100, unique=True)
    used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.token


class RedeemedToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=100, unique=True)
    tier_granted = models.PositiveIntegerField()
    redeemed_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def is_active(self):
        return self.expires_at > timezone.now()

    def __str__(self):
        return f"{self.token} for {self.user.username} (Tier {self.tier_granted})"
