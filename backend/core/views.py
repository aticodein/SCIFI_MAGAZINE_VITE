# views.py
from datetime import timedelta
import os
import shutil
import subprocess
import tempfile
import traceback
from pathlib import Path
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now
import json
from .models import RedeemedToken, UserProfile, UserMiningProgress, CreatorUpload
from django.shortcuts import render
from django.core.files import File
from django.core.management import call_command
from django.db.utils import OperationalError, ProgrammingError
from django.db import IntegrityError
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import logout
from rest_framework.decorators import parser_classes
from rest_framework.parsers import MultiPartParser, FormParser


def _auto_migrate_if_enabled() -> bool:
    """Best-effort auto-migration for simple deployments.

    This helps recover when the production DB is up but migrations haven't been applied yet,
    which otherwise surfaces as a 500 on DB-touching endpoints.
    """
    enable = os.getenv("DJANGO_AUTO_MIGRATE", "True") == "True"
    if not enable:
        return False

    try:
        print("[auto-migrate] running migrations...")
        call_command("migrate", interactive=False, verbosity=1)
        return True
    except Exception:
        print("[auto-migrate] failed:\n" + traceback.format_exc())
        return False

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
@api_view(["GET"])
def check_username(request):
    username = request.session.get("username")
    return Response({"username": username}, status=200)


# ------------------------------
# CREATE USERNAME (POST)   🔥 MUST BE CSRF EXEMPT
# ------------------------------
@csrf_exempt
@api_view(["POST"])
def create_username(request):
    username = request.data.get("username")
    if not username:
        return Response({"error": "Username required"}, status=400)

    try:
        user, created = UserMiningProgress.objects.get_or_create(username=username)
    except (OperationalError, ProgrammingError) as e:
        # Most common production failure: DB exists but migrations/tables are missing.
        print(f"[create-username] DB error: {e!r}")
        if _auto_migrate_if_enabled():
            user, created = UserMiningProgress.objects.get_or_create(username=username)
        else:
            return Response(
                {"error": "Database not ready. Please apply migrations."},
                status=503,
            )
    except Exception:
        print("[create-username] Unexpected error:\n" + traceback.format_exc())
        return Response({"error": "Server error"}, status=500)

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


def _serialize_creator_upload(request, upload: CreatorUpload):
    file_url = ""
    preview_url = ""
    try:
        if upload.file and getattr(upload.file, "url", None):
            file_url = request.build_absolute_uri(upload.file.url)
    except Exception:
        file_url = ""

    try:
        if upload.preview_pdf and getattr(upload.preview_pdf, "url", None):
            preview_url = request.build_absolute_uri(upload.preview_pdf.url)
    except Exception:
        preview_url = ""

    return {
        "id": upload.id,
        "username": upload.username,
        "title": upload.title,
        "original_filename": upload.original_filename,
        "content_type": upload.content_type,
        "size_bytes": upload.size_bytes,
        "created_at": upload.created_at.isoformat(),
        "file_url": file_url,
        "preview_url": preview_url,
    }


def _find_soffice_executable():
    configured = (os.getenv("SOFFICE_PATH") or "").strip()
    if configured:
        return configured
    return shutil.which("soffice") or shutil.which("soffice.exe")


def _maybe_generate_pdf_preview(upload: CreatorUpload) -> None:
    enable = os.getenv("DJANGO_ENABLE_PDF_PREVIEW_CONVERSION", "True") == "True"
    if not enable:
        return

    if not upload or not upload.file:
        return

    original = (upload.original_filename or "").lower()
    ext = Path(original).suffix.lstrip(".")
    if ext not in {"doc", "docx"}:
        return

    soffice = _find_soffice_executable()
    if not soffice:
        return

    timeout = int(os.getenv("DJANGO_PDF_CONVERSION_TIMEOUT_SECONDS", "60"))

    with tempfile.TemporaryDirectory(prefix="scifi_convert_") as tmpdir:
        input_path = os.path.join(tmpdir, f"input.{ext}")

        with upload.file.open("rb") as src, open(input_path, "wb") as dst:
            shutil.copyfileobj(src, dst)

        cmd = [
            soffice,
            "--headless",
            "--nologo",
            "--norestore",
            "--convert-to",
            "pdf",
            "--outdir",
            tmpdir,
            input_path,
        ]

        try:
            subprocess.run(
                cmd,
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=timeout,
            )
        except Exception:
            return

        pdf_files = [p for p in Path(tmpdir).glob("*.pdf") if p.is_file()]
        if not pdf_files:
            return

        pdf_path = pdf_files[0]
        pdf_name = f"{Path(upload.original_filename).stem}.pdf"

        with open(pdf_path, "rb") as f:
            upload.preview_pdf.save(pdf_name, File(f), save=True)


@csrf_exempt
@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_creator_novel(request):
    username = request.session.get("username")
    if not username:
        return Response({"error": "Session login required"}, status=401)

    uploaded_file = request.FILES.get("file")
    title = (request.data.get("title") or "").strip()

    if not uploaded_file:
        return Response({"error": "File is required"}, status=400)
    if not title:
        return Response({"error": "Title is required"}, status=400)

    # Enforce: each user must use a unique title (case-insensitive).
    if CreatorUpload.objects.filter(username=username, title__iexact=title).exists():
        return Response(
            {"error": "You already have an upload with this title. Please choose a unique title."},
            status=409,
        )

    original_name = uploaded_file.name or ""
    ext = os.path.splitext(original_name)[1].lower().lstrip(".")
    allowed = {"pdf", "doc", "docx"}
    if ext not in allowed:
        return Response({"error": "Only PDF, DOC, and DOCX are allowed"}, status=400)

    max_mb = int(os.getenv("DJANGO_UPLOAD_MAX_MB", "25"))
    if uploaded_file.size and uploaded_file.size > max_mb * 1024 * 1024:
        return Response({"error": f"File too large (max {max_mb}MB)"}, status=413)

    try:
        upload = CreatorUpload.objects.create(
            username=username,
            title=title,
            file=uploaded_file,
            original_filename=original_name[:255],
            content_type=(getattr(uploaded_file, "content_type", "") or "")[:100],
            size_bytes=int(getattr(uploaded_file, "size", 0) or 0),
        )
    except IntegrityError:
        # If we race with another request, still return a clean error.
        return Response(
            {"error": "You already have an upload with this title. Please choose a unique title."},
            status=409,
        )

    _maybe_generate_pdf_preview(upload)

    return Response({"upload": _serialize_creator_upload(request, upload)}, status=201)


@csrf_exempt
@api_view(["GET"])
def list_my_creator_novels(request):
    username = request.session.get("username")
    if not username:
        return Response({"error": "Session login required"}, status=401)

    uploads = CreatorUpload.objects.filter(username=username).order_by("-created_at")[:50]
    return Response({"uploads": [_serialize_creator_upload(request, u) for u in uploads]}, status=200)


@csrf_exempt
@api_view(["GET"])
def list_public_creator_novels(request):
    uploads = CreatorUpload.objects.all().order_by("-created_at")[:50]
    return Response({"uploads": [_serialize_creator_upload(request, u) for u in uploads]}, status=200)


@csrf_exempt
@api_view(["DELETE"])
def delete_creator_upload(request, upload_id: int):
    username = request.session.get("username")
    if not username:
        return Response({"error": "Session login required"}, status=401)

    try:
        upload = CreatorUpload.objects.get(id=upload_id)
    except CreatorUpload.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    if upload.username != username:
        return Response({"error": "Forbidden"}, status=403)

    # Delete stored files first (works for local disk + S3/Spaces)
    try:
        if upload.file:
            upload.file.delete(save=False)
    except Exception:
        pass

    try:
        if upload.preview_pdf:
            upload.preview_pdf.delete(save=False)
    except Exception:
        pass

    upload.delete()
    return Response({"ok": True}, status=200)
