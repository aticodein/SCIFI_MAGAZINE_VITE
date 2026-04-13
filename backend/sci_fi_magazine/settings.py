import os
from urllib.parse import urlparse
from pathlib import Path
import dj_database_url
import jazzmin  # ensures jazzmin is loaded early
from corsheaders.defaults import default_headers

BASE_DIR = Path(__file__).resolve().parent.parent

# ------------------------------------------
# DJANGO CORE SETTINGS
# ------------------------------------------

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "changeme")
DEBUG = os.getenv("DJANGO_DEBUG", "True") == "True"

def _coerce_allowed_host(value: str) -> str | None:
    value = (value or "").strip()
    if not value:
        return None
    if value == "*":
        return "*"

    # Support common misconfiguration: env var contains a full URL.
    if "://" in value:
        try:
            parsed = urlparse(value)
            if parsed.hostname:
                return parsed.hostname
        except Exception:
            pass

    # Remove any path and port fragments.
    value = value.split("/")[0]
    value = value.split(":")[0]
    return value or None


_raw_allowed_hosts = os.getenv("DJANGO_ALLOWED_HOSTS", "*")
ALLOWED_HOSTS: list[str] = []
for part in _raw_allowed_hosts.split(","):
    host = _coerce_allowed_host(part)
    if host and host not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append(host)

if not ALLOWED_HOSTS:
    # Preserve historical behavior: default to permissive hosts.
    ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "corsheaders",                    # <-- needed early
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "core",
]

DJANGO_STORAGE_BACKEND = os.getenv("DJANGO_STORAGE_BACKEND", "local").lower()
if DJANGO_STORAGE_BACKEND == "s3":
    INSTALLED_APPS.append("storages")

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",      # <-- MUST BE FIRST!
    "django.middleware.common.CommonMiddleware",

    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "sci_fi_magazine.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "sci_fi_magazine.wsgi.application"

# ------------------------------------------
# DATABASE
# ------------------------------------------

DATABASES = {
    "default": dj_database_url.config(default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}")
}

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Europe/Dublin"
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ------------------------------------------
# CORS CONFIGURATION
# ------------------------------------------

CORS_ALLOW_CREDENTIALS = True

# Allow exact known origins
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:8888",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8888",
    "https://golden-lebkuchen-879258.netlify.app",   # <-- main production site
]

# Allow ANY Netlify preview URL:
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https:\/\/.*--golden-lebkuchen-879258\.netlify\.app$",
]

CORS_ALLOW_HEADERS = list(default_headers)
CORS_EXPOSE_HEADERS = ["content-type", "authorization"]
CORS_ALLOW_METHODS = ["GET", "POST", "DELETE", "OPTIONS"]

# ------------------------------------------
# COOKIE & CSRF CONFIGURATION
# ------------------------------------------

# These get overridden below when IS_PRODUCTION=True
SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SECURE = False

CSRF_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SECURE = False

# Required for cross-site cookies
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000",
    "https://golden-lebkuchen-879258.netlify.app",
]

IS_PRODUCTION = os.getenv("DJANGO_PRODUCTION", "False") == "True"

if IS_PRODUCTION:
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True

    CSRF_COOKIE_SAMESITE = "None"
    CSRF_COOKIE_SECURE = True

# ------------------------------------------
# STATIC FILES
# ------------------------------------------

STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
}

if DJANGO_STORAGE_BACKEND == "s3":
    STORAGES["default"] = {
        "BACKEND": "storages.backends.s3.S3Storage",
    }

# If your host uses Whitenoise, keep static files local.
# MEDIA uploads can be local or S3/Spaces based on DJANGO_STORAGE_BACKEND.

# ------------------------------------------
# MEDIA (USER UPLOADS)
# ------------------------------------------

MEDIA_URL = os.getenv("DJANGO_MEDIA_URL", "/media/")
MEDIA_ROOT = os.getenv("DJANGO_MEDIA_ROOT", str(BASE_DIR / "media"))

# ------------------------------------------
# S3/Spaces (only used when DJANGO_STORAGE_BACKEND=s3)
# ------------------------------------------

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "")
AWS_STORAGE_BUCKET_NAME = os.getenv("AWS_STORAGE_BUCKET_NAME", "")

# DigitalOcean Spaces example endpoint:
#   https://nyc3.digitaloceanspaces.com
AWS_S3_ENDPOINT_URL = os.getenv("AWS_S3_ENDPOINT_URL", "")
AWS_S3_REGION_NAME = os.getenv("AWS_S3_REGION_NAME", "")

# For public file URLs. Example:
#   <bucket>.<region>.digitaloceanspaces.com
AWS_S3_CUSTOM_DOMAIN = os.getenv("AWS_S3_CUSTOM_DOMAIN", "")

# If you want public-read URLs (matches current Reader UI which links directly):
AWS_QUERYSTRING_AUTH = os.getenv("AWS_QUERYSTRING_AUTH", "False") == "True"
AWS_DEFAULT_ACL = os.getenv("AWS_DEFAULT_ACL", "public-read")

_upload_max_mb = int(os.getenv("DJANGO_UPLOAD_MAX_MB", "25"))
DATA_UPLOAD_MAX_MEMORY_SIZE = _upload_max_mb * 1024 * 1024
FILE_UPLOAD_MAX_MEMORY_SIZE = _upload_max_mb * 1024 * 1024
