from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now
from django.http import JsonResponse
import json
from .models import RedeemedToken, UserProfile

def ping(request):
    return JsonResponse({"message": "pong"})


@csrf_exempt
def redeem_token(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    if not request.user.is_authenticated:
        return JsonResponse({"error": "Auth required"}, status=401)
    
    

    try:
        data = json.loads(request.body)
        token_input = data.get("token", "").strip()
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    if not token_input or "-" not in token_input:
        return JsonResponse({"error": "Invalid token format"}, status=400)

    # Check if already redeemed
    if RedeemedToken.objects.filter(user=request.user, token=token_input).exists():
        return JsonResponse({"error": "Token already redeemed."}, status=403)

    # For demo: all tokens grant Tier 3
    expires = now() + timedelta(days=30)
    RedeemedToken.objects.create(
        user=request.user,
        token=token_input,
        tier_granted=3,
        expires_at=expires
    )

    return JsonResponse({
        "message": "Token redeemed! Tier 3 unlocked for 30 days.",
        "expires": expires.strftime("%Y-%m-%d %H:%M:%S")
    })
