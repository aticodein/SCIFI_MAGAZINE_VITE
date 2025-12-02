# views.py
from datetime import timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now
import json
from .models import RedeemedToken, UserProfile, UserMiningProgress
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import logout

# ------------------------------
# LOGOUT
# ------------------------------
@csrf_exempt
@api_view(["POST"])
def logout_view(request):
    logout(request)
    return Response({"message": "Logged out successfully"}, status=200)


# ------------------------------
# CHECK USERNAME (GET)
# ------------------------------
@csrf_exempt
def check_username(request):
    if request.method == 'GET':
        username = request.session.get('username')
        return JsonResponse({'username': username})


# ------------------------------
# CREATE USERNAME (POST)   🔥 MUST BE CSRF EXEMPT
# ------------------------------
@csrf_exempt
@api_view(["POST"])
def create_username(request):
    username = request.data.get("username")
    if not username:
        return Response({"error": "Username required"}, status=400)

    user, created = UserMiningProgress.objects.get_or_create(username=username)

    # Save username in session
    request.session['username'] = username

    if created:
        return Response({"message": "Username created successfully"}, status=201)

    else:
        # Return 409 Conflict for frontend logic, but session saved
        return Response({"error": "Username already exists"}, status=409)


# ------------------------------
# DELETE USER (POST)
# ------------------------------
@csrf_exempt
@api_view(["POST"])
def delete_user(request):
    username = request.session.get("username")
    if not username:
        return Response({"error": "Not logged in"}, status=401)

    try:
        user = UserMiningProgress.objects.get(username=username)
        user.delete()
        request.session.flush()
        return Response({"message": "User deleted successfully."}, status=200)
    except UserMiningProgress.DoesNotExist:
        return Response({"error": "User not found."}, status=404)


# ------------------------------
# PING
# ------------------------------
def ping(request):
    return JsonResponse({"message": "pong"})


# ------------------------------
# REDEEM TOKEN
# ------------------------------
@csrf_exempt
def redeem_token(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    username = request.session.get("username")
    if not username:
        return JsonResponse({"error": "Session login required"}, status=401)

    try:
        data = json.loads(request.body)
        token_input = data.get("token", "").strip()
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    if not token_input or "-" not in token_input:
        return JsonResponse({"error": "Invalid token format"}, status=400)

    try:
        user_progress = UserMiningProgress.objects.get(username=username)
    except UserMiningProgress.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    part = token_input[0].upper()
    if part in ['A', 'B', 'C', 'D', 'E']:
        code_field = f"code_{part}"
        setattr(user_progress, code_field, token_input)
        user_progress.save()

    if RedeemedToken.objects.filter(token=token_input).exists():
        return JsonResponse({"error": "Token already redeemed."}, status=403)

    expires = now() + timedelta(days=30)
    RedeemedToken.objects.create(
        user=None,
        token=token_input,
        tier_granted=3,
        expires_at=expires
    )

    return JsonResponse({
        "message": "Token redeemed! Tier 3 unlocked for 30 days.",
        "expires": expires.strftime("%Y-%m-%d %H:%M:%S"),
        "user": username,
    })
