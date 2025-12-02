# core/models.py

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class UserMiningProgress(models.Model):
    """
    Stores a simple, session-based user 'account' for the CFE / Pro system.
    Backed only by a username (no password), plus the code parts A–E.
    """
    username = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Optional: store the code pieces the user has redeemed
    code_A = models.CharField(max_length=32, null=True, blank=True)
    code_B = models.CharField(max_length=32, null=True, blank=True)
    code_C = models.CharField(max_length=32, null=True, blank=True)
    code_D = models.CharField(max_length=32, null=True, blank=True)
    code_E = models.CharField(max_length=32, null=True, blank=True)

    def __str__(self):
        return self.username


class UserProfile(models.Model):
    """
    Optional: used if/when you hook into real Django auth users.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    tier = models.PositiveIntegerField(default=1)  # Paid or current level

    def get_effective_tier(self):
        active_tokens = RedeemedToken.objects.filter(
            user=self.user,
            expires_at__gt=timezone.now()
        ).order_by("-tier_granted")
        if active_tokens.exists():
            return max(self.tier, active_tokens.first().tier_granted)
        return self.tier

    def __str__(self):
        return f"{self.user.username} (Tier {self.get_effective_tier()})"


class RetroToken(models.Model):
    """
    Legacy / optional retro access tokens, still tied to Django User.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    token = models.CharField(max_length=100, unique=True)
    used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.token


class RedeemedToken(models.Model):
    """
    Tokens redeemed via the 5-part A–E flow.
    Currently your views use session usernames and pass user=None.
    Make 'user' nullable so that works.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    token = models.CharField(max_length=100, unique=True)
    tier_granted = models.PositiveIntegerField()
    redeemed_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def is_active(self):
        return self.expires_at > timezone.now()

    def __str__(self):
        if self.user:
            who = self.user.username
        else:
            who = "session-user"
        return f"{self.token} for {who} (Tier {self.tier_granted})"
