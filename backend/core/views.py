# views.py
from datetime import timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now
import json
from .models import RedeemedToken, UserProfile, UserMiningProgress
from django.shortcuts import render
from django.contrib.auth import logout
from django.contrib.auth.models import User

@csrf_exempt
def logout_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)
    logout(request)  # Clears the Django session
    return JsonResponse({"message": "Logged out successfully"}, status=200)


@csrf_exempt
def check_username(request):
    if request.method == 'GET':
        username = request.session.get('username')  # ← if you save username in session
        print(f"🔍 Session check - Session ID: {request.session.session_key}")
        print(f"🔍 Session data: {dict(request.session)}")
        print(f"🔍 Username in session: {username}")
        if username:
            return JsonResponse({'username': username})
        else:
            return JsonResponse({'username': None})

@csrf_exempt
def create_username(request):
    print(f"🚀 create_username called - Method: {request.method}")
    print(f"🚀 Headers: {dict(request.headers)}")
    print(f"🚀 Origin: {request.headers.get('origin')}")
    
    if request.method != "POST":
        print("❌ Method not POST")
        return JsonResponse({"error": "Only POST allowed"}, status=405)
    
    try:
        print(f"🚀 Request body: {request.body}")
        data = json.loads(request.body)
        username = data.get("username")
        print(f"🚀 Parsed username: {username}")
    except json.JSONDecodeError as e:
        print(f"❌ JSON decode error: {e}")
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    if not username:
        return JsonResponse({"error": "Username required"}, status=400)

    print(f"🚀 PRODUCTION HOTFIX - Login attempt for username: {username}")
    user, created = UserMiningProgress.objects.get_or_create(username=username)

    request.session['username'] = username
    request.session.save()  # Explicitly save the session
    print(f"🔑 Session set - Session ID: {request.session.session_key}")
    print(f"🔑 Session data: {dict(request.session)}")

    if created:
        print(f"✨ New user created: {username}")
        return JsonResponse({"message": "Username created successfully"}, status=201)  # 201 Created
    else:
        print(f"👋 Existing user login: {username}")
        return JsonResponse({"error": "Username already exists"}, status=409)  # 🔥 409 Conflict
    
@csrf_exempt
def delete_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)
        
    username = request.session.get("username")
    if not username:
        return JsonResponse({"error": "Not logged in"}, status=401)

    try:
        user = UserMiningProgress.objects.get(username=username)
        user.delete()
        request.session.flush()  # Wipe session completely
        return JsonResponse({"message": "User deleted successfully."}, status=200)
    except UserMiningProgress.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)




def ping(request):
    return JsonResponse({"message": "pong"})

def home(request):
    """Simple home page for the backend API"""
    return JsonResponse({
        "message": "🚀 Sci-Fi Magazine Backend API",
        "version": "1.0",
        "admin": "/admin/",
        "api_endpoints": {
            "check_username": "/api/check-username/",
            "create_username": "/api/create-username/",
            "logout": "/api/logout/",
            "token_redeem": "/api/token/redeem/",
            "ping": "/api/ping/"
        }
    })


@csrf_exempt
def redeem_token(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    # ✅ Use session-stored username instead of Django-auth user
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

    # Check if user exists in mining progress
    try:
        user_progress = UserMiningProgress.objects.get(username=username)
    except UserMiningProgress.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    # TODO: PRODUCTION HOTFIX - Temporarily disabled code_A-E fields until migrations run
    # Optionally: Save token to code_A–E if not already present
    # part = token_input[0].upper()
    # if part in ['A', 'B', 'C', 'D', 'E']:
    #     code_field = f"code_{part}"
    #     setattr(user_progress, code_field, token_input)
    #     user_progress.save()

    # Token uniqueness check (optional for session users)
    if RedeemedToken.objects.filter(token=token_input).exists():
        return JsonResponse({"error": "Token already redeemed."}, status=403)

    expires = now() + timedelta(days=30)
    RedeemedToken.objects.create(
        user=None,  # You’re not linking to auth.User
        token=token_input,
        tier_granted=3,
        expires_at=expires
    )

    return JsonResponse({
        "message": "Token redeemed! Tier 3 unlocked for 30 days.",
        "expires": expires.strftime("%Y-%m-%d %H:%M:%S"),
        "user": username,
    })


@csrf_exempt
def create_admin_user(request):
    """Temporary endpoint to create admin user - REMOVE AFTER USE"""
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)
    
    try:
        data = json.loads(request.body)
        username = data.get("username", "admin")
        password = data.get("password", "adminpass123")
        
        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Admin user already exists"}, status=409)
        
        user = User.objects.create_superuser(
            username=username,
            email="admin@scifimagazine.com",
            password=password
        )
        
        return JsonResponse({
            "message": f"Superuser '{username}' created successfully!",
            "login_url": "/admin/",
            "note": "IMPORTANT: Remove this endpoint after use!"
        })
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt  
def view_users(request):
    """Temporary endpoint to view user data - REMOVE AFTER USE"""
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=405)
    
    try:
        users = UserMiningProgress.objects.all().values('username', 'created_at')
        user_count = UserMiningProgress.objects.count()
        
        return JsonResponse({
            "total_users": user_count,
            "users": list(users),
            "note": "IMPORTANT: Remove this endpoint after use!"
        })
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt  
def check_admin_status(request):
    """Check admin interface status and superuser existence"""
    try:
        from django.contrib.auth.models import User
        from django.urls import reverse
        from django.contrib import admin
        from django.conf import settings
        
        # Check if any superuser exists
        superusers = User.objects.filter(is_superuser=True)
        admin_users = list(superusers.values('username', 'email', 'is_active', 'date_joined'))
        
        # Check admin URL resolution
        try:
            admin_url = reverse('admin:index')
            admin_url_works = True
        except Exception as url_error:
            admin_url_works = False
            admin_url = f"Error resolving admin URL: {str(url_error)}"
        
        return JsonResponse({
            "admin_url_resolution": admin_url_works,
            "admin_url": admin_url,
            "superuser_count": len(admin_users),
            "superusers": admin_users,
            "admin_site_name": admin.site.site_header if hasattr(admin.site, 'site_header') else "Django Administration",
            "debug": settings.DEBUG,
            "production_admin_url": "https://scifi-magazine-vite-production.up.railway.app/admin/"
        })
        
    except Exception as e:
        return JsonResponse({"error": str(e), "traceback": str(e)}, status=500)
