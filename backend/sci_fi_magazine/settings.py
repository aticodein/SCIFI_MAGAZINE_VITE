import os
from pathlib import Path
import dj_database_url
import jazzmin  # ensures jazzmin is loaded early

BASE_DIR = Path(__file__).resolve().parent.parent

# ------------------------------------------
# DJANGO CORE SETTINGS
# ------------------------------------------

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "changeme")
DEBUG = os.getenv("DJANGO_DEBUG", "True") == "True"

ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS", "*").split(",")

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
    "https://golden-lebkuchen-879258.netlify.app",   # <-- main production site
]

# Allow ANY Netlify preview URL:
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https:\/\/.*--golden-lebkuchen-879258\.netlify\.app$",
]

CORS_ALLOW_HEADERS = ["*"]
CORS_EXPOSE_HEADERS = ["content-type", "authorization"]
CORS_ALLOW_METHODS = ["GET", "POST", "OPTIONS"]

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
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
