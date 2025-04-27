# views.py
from datetime import timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now
from django.http import JsonResponse
import json
from .models import RedeemedToken, UserProfile
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import UserMiningProgress
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import logout

@api_view(["POST"])
def logout_view(request):
    logout(request)  # Clears the Django session
    return Response({"message": "Logged out successfully"}, status=200)


@csrf_exempt
def check_username(request):
    if request.method == 'GET':
        username = request.session.get('username')  # ← if you save username in session
        if username:
            return JsonResponse({'username': username})
        else:
            return JsonResponse({'username': None})

@api_view(["POST"])
def create_username(request):
    username = request.data.get("username")
    if not username:
        return Response({"error": "Username required"}, status=400)

    user, created = UserMiningProgress.objects.get_or_create(username=username)

    if created:
        request.session['username'] = username
        return Response({"message": "Username created successfully"}, status=201)  # 201 Created
    else:
        request.session['username'] = username
        return Response({"error": "Username already exists"}, status=409)  # 🔥 409 Conflict



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

def landing_page(request):
    return render(request, "landing_page.html")
