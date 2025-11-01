import os
from pathlib import Path
import dj_database_url
import jazzmin  # ensures jazzmin is loaded early

BASE_DIR = Path(__file__).resolve().parent.parent

# ✅ Secure & toggleable
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "changeme")
DEBUG = os.getenv("DJANGO_DEBUG", "True") == "True"

# ✅ Use env or fallback
ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS", "*").split(",")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "core",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # ⬅ already good placement
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

# ✅ DATABASE toggle for Render
DATABASES = {
    "default": dj_database_url.config(default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}")
}

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Europe/Dublin"
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ✅ CORS SETTINGS for Netlify frontend + local dev
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8888",
    "http://localhost:5173",  # Default Vite port
    "http://localhost:5174",  # Alternative Vite port (currently in use)
    "http://localhost:3000",  # Common React dev port
    "http://127.0.0.1:5173",  # 127.0.0.1 Vite port - ADDED FOR CORS FIX
    "http://127.0.0.1:5174",  # 127.0.0.1 Alternative Vite port - ADDED FOR CORS FIX
    "https://golden-lebkuchen-879258.netlify.app",  # ✅ YOUR ACTUAL FRONTEND
    "https://6842f268ac8e1527c7aa38cd--golden-lebkuchen-879258.netlify.app",
    "https://web-production-2e557.up.railway.app",  # ✅ BACKEND PRODUCTION URL

]

CORS_ALLOW_HEADERS = [
    "content-type",
    "authorization",
    "x-csrftoken",
]

CORS_EXPOSE_HEADERS = [
    "content-type",
    "authorization",
]

# ✅ Cookies behave properly for cross-origin sessions
SESSION_COOKIE_SAMESITE = "None"
SESSION_COOKIE_SECURE = not DEBUG  # True in production, False locally

# ✅ Static Files
STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://golden-lebkuchen-879258.netlify.app",
    "https://web-production-2e557.up.railway.app",  # ✅ BACKEND PRODUCTION URL
]

CSRF_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SECURE = False

# 🔧 PRODUCTION DETECTION - Better Railway detection
IS_PRODUCTION = (
    os.getenv("RAILWAY_ENVIRONMENT") is not None or 
    os.getenv("DJANGO_PRODUCTION", "False") == "True" or
    "railway.app" in os.getenv("RAILWAY_PUBLIC_DOMAIN", "")
)

print(f"🌍 Production mode: {IS_PRODUCTION}")
print(f"🌍 Railway environment: {os.getenv('RAILWAY_ENVIRONMENT')}")
print(f"🌍 Railway domain: {os.getenv('RAILWAY_PUBLIC_DOMAIN')}")

if IS_PRODUCTION:
    CSRF_COOKIE_SAMESITE = "None"
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True
    
    # 🔧 Additional session settings for cross-origin
    SESSION_COOKIE_DOMAIN = None  # Let Django handle it automatically
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_AGE = 86400 * 7  # 7 days
    SESSION_SAVE_EVERY_REQUEST = True
    
    # ✅ Additional Production Security Settings
    # 🚨 DISABLED: Railway handles SSL termination, internal communication is HTTP
    # SECURE_SSL_REDIRECT = True  # This causes redirect loops on Railway
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = 'DENY'
    
else:
    CSRF_COOKIE_SAMESITE = "Lax"
    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = False
    SESSION_COOKIE_AGE = 86400 * 7  # 7 days
    SESSION_SAVE_EVERY_REQUEST = False

