import os
from pathlib import Path
import jazzmin  # 👈 ensures jazzmin is loaded early


BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "changeme")

DEBUG = True

ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "jazzmin",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    # your apps:
    "core",  # (we’ll create this later)
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
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

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# sci_fi_magazine/settings.py


AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Europe/Dublin"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8888",  # your frontend dev server
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

SESSION_COOKIE_SAMESITE = None
SESSION_COOKIE_SECURE = False  # True if you are running HTTPS later

JAZZMIN_SETTINGS = {
    "site_title": "Sci-Fi Magazine Admin",
    "site_brand": "Sci-FiMag",
    "welcome_sign": "Welcome to the Sci-Fi Magazine Admin Panel",
    "copyright": "",

    "topmenu_links": [
        {"name": "Landing Page", "url": "/", "new_window": True},
        {"name": "Frontend (Netlify)", "url": "https://golden-lebkuchen-879258.netlify.app", "new_window": True},
    ],

    "usermenu_links": [
        {"name": "Return to Landing", "url": "/", "icon": "fas fa-rocket", "new_window": True},
    ],

    "show_sidebar": True,
    "navigation_expanded": True,

    "icons": {
        "auth": "fas fa-users-cog",
        "core.UserProfile": "fas fa-user-astronaut",
        "core.RetroToken": "fas fa-key",
    },

    "default_icon_parents": "fas fa-cogs",
    "default_icon_children": "fas fa-dot-circle",

}

JAZZMIN_UI_TWEAKS = {
    "theme": "darkly",
}


