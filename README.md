# JobGuard — Fake Job Alert Detection System

AI-powered fake job alert detector with **Telugu + English** support, red flag detection, JWT auth, and admin panel.

## Features

- **Checker** — Paste any job posting, get FAKE/REAL verdict with confidence scores
- **Dashboard** — Live stats, top red flags, city-wise scam reports
- **Report** — Submit undetected scam jobs
- **Login/Signup** — JWT authentication
- **Admin Panel** — Manage users, reports, predictions (admin only)

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React + Vite + React Router |
| Backend | FastAPI + SQLite + JWT |
| ML | TF-IDF + Logistic Regression |
| NLP | Telugu translation (deep-translator), regex red flags |
| Deploy | Render (Web Service + Static Site) |

## Quick Start (Local)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python train_model.py
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### Default Admin

- Email: `admin@jobguard.app`
- Password: `admin123`

Change these via `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/predict` | Classify job posting |
| GET | `/stats` | Dashboard statistics |
| POST | `/report` | Submit scam report |
| POST | `/auth/signup` | Register |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Current user |
| GET | `/admin/*` | Admin routes (JWT + admin role) |

## Deploy to Render

1. Push this repo to GitHub
2. Create a **Blueprint** from `render.yaml`, or create two services manually:

**Backend (Web Service)**
- Root: `backend`
- Build: `pip install -r requirements.txt && python train_model.py`
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Env: `SECRET_KEY`, `CORS_ORIGINS` (your frontend URL), `ADMIN_PASSWORD`

**Frontend (Static Site)**
- Root: `frontend`
- Build: `npm install && npm run build`
- Publish: `dist`
- Env: `VITE_API_URL` = your backend URL (e.g. `https://jobguard-api.onrender.com`)

3. Set `CORS_ORIGINS` on backend to include your frontend URL

## Project Structure

```
jobguard/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry
│   │   ├── auth.py          # JWT helpers
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── ml/              # TF-IDF classifier, red flags, translator
│   │   └── routers/         # API routes
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/           # Checker, Dashboard, Report, Login, Admin
│   │   ├── components/      # Nav
│   │   └── context/         # AuthContext
│   └── package.json
└── render.yaml
```

## License

MIT
