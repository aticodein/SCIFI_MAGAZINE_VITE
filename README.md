🚀 Sci-Fi Magazine – Backend + Frontend Platform

Sci-Fi Magazine is an AI-powered creative platform for sci-fi lovers, combining modern content creation tools, classic sci-fi collections, and retro-inspired gamified experiences.

Project Structure:

/SCI-FI-MAGAZINE-V3-UPDATED/

backend/ # Django backend (Admin, APIs, Token system)

frontend/ # Vite + React frontend (User interface)

netlify/ # Serverless functions (temporary APIs)

.netlify/ # Netlify CLI configuration

.gitignore

README.md

Tech Stack:

Frontend: React 18, Vite, TailwindCSS 3, Framer Motion

Backend: Django 4.2+, Django REST Framework (planned APIs)

Serverless Functions: Netlify Functions (for interim APIs)

Database: SQLite3 (development) ➔ PostgreSQL (production)

Storage: Cloudflare R2 (planned)

Hosting: Netlify (Frontend) + Railway (Backend)

Running the Project:

Start Frontend: cd frontend npm install npm run dev (localhost:5173)

Start Backend: cd backend python manage.py migrate python manage.py runserver (localhost:8000 - Admin at /admin/)

Deployment (Netlify + Railway):

- Frontend calls the API using same-origin paths (`/api/...` and `/media/...`).
  - Dev: Vite proxies `/api` + `/media` to `http://localhost:8000`.
  - Prod: Netlify redirects in `frontend/public/_redirects` proxy to Railway.

Railway environment variables (recommended):

- `DJANGO_SECRET_KEY` (required)
- `DJANGO_DEBUG=False`
- `DJANGO_ALLOWED_HOSTS` (include your Railway domain)
- `DATABASE_URL` (Postgres recommended)
- `DJANGO_PRODUCTION=True` (enables secure cookie settings)
- `DJANGO_AUTO_MIGRATE=True` (keeps DB schema in sync on deploy)
- Optional:
  - `DJANGO_UPLOAD_MAX_MB` (default 25)
  - `DJANGO_ENABLE_PDF_PREVIEW_CONVERSION` (default True; needs LibreOffice/soffice)
  - `SOFFICE_PATH` (if Railway image provides it in a non-standard path)

Netlify settings:

- Ensure the site deploy includes `frontend/public/_redirects`.
- No `VITE_API_URL` is required (API defaults to same-origin `/api`).

Full Localstack (Frontend + Functions): cd SCI-FI-MAGAZINE-V3-UPDATED netlify dev

Key Features:

Cinematic landing pages and themed sections: Read, Create, Watch, Retro

User Tier System: Visitor → Commander

Token mining system hidden in Retro Zone (5-part unlock)

Admin Portal with Jazzmin/Grappelli theme

Blog, Comment, and Upload APIs (under development)

Stripe Pro Plans (planned)

Status:

Backend Gateway Landing Page ✅ Ready Frontend Cinematic Landing Page ✅ Ready Admin Dashboard ✅ Ready APIs + Pro Systems 🚧 In Development

License:

Private Project – All Rights Reserved © 2025 Sci-Fi Magazine

BACKEND DEV COMMAND LINE:
cd backend
source env/bin/activate
python manage.py runserver

FRONTEND DEV COMMANDLINE
cd frontend
netlify dev
