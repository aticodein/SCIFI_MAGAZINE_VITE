🚀 Sci-Fi Magazine – Backend + Frontend Platform

Sci-Fi Magazine is an AI-powered creative platform for sci-fi lovers, combining modern content creation tools, classic sci-fi collections, and retro-inspired gamified experiences.

## 📁 Project Structure

```
SCIFI_MAGAZINE_VITE/
├── backend/                 # Django REST API & Admin Panel
│   ├── core/               # Main app (models, views, URLs)
│   ├── sci_fi_magazine/    # Django project settings
│   ├── env/                # Python virtual environment
│   ├── manage.py           # Django management commands
│   ├── requirements.txt    # Python dependencies
│   └── .env.production     # Production environment variables
├── frontend/               # React + Vite SPA
│   ├── src/               # React components and pages
│   ├── public/            # Static assets
│   ├── netlify/           # Netlify serverless functions
│   ├── .env               # Development environment variables
│   ├── .env.production    # Production environment variables
│   └── package.json       # Node.js dependencies
├── netlify.toml           # Netlify deployment configuration
└── README.md              # This file
```

## 🛠️ Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite 6.3.2 (Build tool & Dev server)
- TailwindCSS 3.4+ (Styling)
- React Router 6 (Client-side routing)
- React Hot Toast (Notifications)
- Framer Motion (Animations)

**Backend:**
- Django 5.2 (Web framework)
- Django REST Framework 3.16 (API framework)
- Django CORS Headers (Cross-origin requests)
- WhiteNoise (Static file serving)
- Gunicorn (Production WSGI server)

**Database:**
- SQLite3 (Development)
- PostgreSQL (Production)

**Deployment:**
- Frontend: Netlify (https://golden-lebkuchen-879258.netlify.app)
- Backend: Railway (https://web-production-2e557.up.railway.app)

**Development Tools:**
- Netlify Dev (Local development server)
- Django Debug Toolbar
- Hot module replacement (HMR)

## 🚀 Running the Project

### Prerequisites
- **Node.js** 18+ (for frontend)
- **Python** 3.11+ (for backend)
- **Git** (for version control)

### Quick Start (Both Servers)

#### 1. **Backend Server (Django)**
```powershell
# Navigate to backend directory
cd backend

# Activate virtual environment (Windows PowerShell)
.\env\Scripts\Activate.ps1

# Install dependencies (first time only)
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Start Django development server
python manage.py runserver
```
**Backend URLs:**
- API: http://127.0.0.1:8000/
- Admin Panel: http://127.0.0.1:8000/admin/

#### 2. **Frontend Server (React + Vite + Netlify)**
```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start Netlify development server with Vite
netlify dev
```
**Frontend URLs:**
- Vite Dev Server: http://localhost:5173/
- Netlify Dev Server: http://localhost:8888/

### 🔄 Development Workflow

**Start Both Servers:**
1. Open **two terminal windows**
2. Run backend commands in terminal 1
3. Run frontend commands in terminal 2
4. Both servers will auto-reload on file changes

## ✨ Key Features

### 🎯 **Core Features**
- **Cinematic Landing Pages**: Themed sections for Read, Create, Watch, Retro
- **User Authentication**: Session-based login system with username creation
- **User Tier System**: Visitor → Commander progression
- **Token Mining System**: Hidden 5-part unlock mechanism in Retro Zone
- **Admin Dashboard**: Django admin with Jazzmin theme
- **Responsive Design**: Mobile-first TailwindCSS implementation

### 🔧 **Technical Features**
- **RESTful APIs**: Django REST Framework endpoints
- **Cross-Origin Requests**: CORS configured for frontend-backend communication
- **Session Management**: Secure cookie-based sessions
- **Static File Serving**: WhiteNoise for production static files
- **Environment Configuration**: Separate dev/production settings
- **Hot Module Replacement**: Real-time development updates

### 🚧 **In Development**
- Blog and Comment APIs
- File Upload functionality  
- Stripe Pro Plans integration
- Content Management System
- Advanced user permissions

## 📊 Current Status

| Component | Development | Production |
|-----------|------------|------------|
| Backend API Gateway | ✅ Ready | ✅ Ready |
| Frontend SPA | ✅ Ready | ✅ Ready |
| Admin Dashboard | ✅ Ready | ✅ Ready |
| User Authentication | ✅ Ready | ✅ Ready |
| Database Models | ✅ Ready | ✅ Ready |
| CORS Configuration | ✅ Ready | ✅ Ready |
| Token System | 🚧 In Progress | ⏳ Pending |
| Blog APIs | 🚧 In Progress | ⏳ Pending |
| Payment Integration | ⏳ Planned | ⏳ Planned |

## 📝 Development Notes

### Database Models
- **UserMiningProgress**: Stores username and 5 token codes (A-E)
- **RetroToken**: Individual token management
- **RedeemedToken**: Token redemption tracking with expiry

### Session Management
- Cookie-based sessions for cross-origin authentication
- Automatic session cleanup on logout
- Secure cookie settings for production HTTPS

### Code Organization
- **Frontend**: Component-based React architecture
- **Backend**: Django app structure with clear separation of concerns
- **APIs**: RESTful design with consistent error handling

## 🤝 Contributing

This is a private project. For development team members:

1. **Clone repository**: `git clone [repository-url]`
2. **Create feature branch**: `git checkout -b feature/new-feature`
3. **Follow setup instructions** above
4. **Test both environments** before committing
5. **Submit pull request** for review

## 📄 License

**Private Project** – All Rights Reserved © 2025 Sci-Fi Magazine

Unauthorized copying, distribution, or use of this software is strictly prohibited.


## 🔧 Environment Configuration

### Development Environment
- **Backend**: `http://127.0.0.1:8000/`
- **Frontend**: `http://localhost:5173/` | `http://localhost:8888/`
- **Database**: SQLite3 (local file)
- **CORS**: Localhost ports whitelisted
- **Debug**: Enabled with detailed error pages

### Production Environment
- **Backend**: `https://web-production-2e557.up.railway.app`
- **Frontend**: `https://golden-lebkuchen-879258.netlify.app`
- **Database**: PostgreSQL (Railway)
- **Security**: SSL, HSTS, XSS protection enabled
- **Static Files**: WhiteNoise + CDN

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
```powershell
# Make sure you're in the backend directory
cd backend

# Check if virtual environment exists
ls .\env\Scripts\

# If activation fails, ensure PowerShell execution policy allows scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Frontend won't start:**
```powershell
# Make sure Node.js is installed
node --version

# Clear npm cache if needed
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**CORS errors in browser:**
- Check that backend is running on port 8000
- Verify frontend is running on port 5173 or 8888
- Ensure both servers are running simultaneously

## 🚀 Deployment

### Backend (Railway)
1. Connect GitHub repository to Railway
2. Set environment variables from `.env.production`
3. Railway auto-deploys on git push to main branch

### Frontend (Netlify) 
1. Connect GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variables configured in Netlify dashboard

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/create-username/` - Create or login user
- `GET /api/check-username/` - Verify session
- `POST /api/logout/` - End session
- `POST /api/delete-user/` - Delete user account

### Token System
- `POST /api/token/redeem/` - Redeem 5-part token codes

### Utility
- `GET /api/ping/` - Health check
- `GET /` - API information