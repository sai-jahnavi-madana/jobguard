# JobGuard — Fake Job Alert Detection System

> A free **community service** web app that helps job seekers spot fake job scams before they lose money or share personal details.

**Built by:** Sai Jahnavi Madana  
**Repository:** [github.com/sai-jahnavi-madana/jobguard](https://github.com/sai-jahnavi-madana/jobguard)

---

## Overview


---

## Who Is It For?

| Audience | Use Case |
|----------|----------|
| Job seekers & students | Verify a job posting before applying |
| Freshers | Identify scams promising easy money with no experience |
| Telugu speakers | Analyse job alerts written in Telugu |
| General public | Check forwarded WhatsApp job messages |
| Community | Report undetected scams to protect others |

---

## Features

### Check Job (Home)
- Paste any job posting — Telugu or English
- Instant **FAKE / REAL** verdict with confidence %
- Red flag detection (registration fee, WhatsApp only, guaranteed income, etc.)
- Bilingual results — switch between **English** and **తెలుగు**
- Share results on **WhatsApp**
- Sample fake/real jobs to try

### Dashboard
- Live stats: total checked, fake detected, real verified, scams reported
- Top red flag phrases
- City-wise scam reports
- Detection rate chart

### Report Scam
- Submit fake jobs that JobGuard missed
- Optional company name and city
- Cybercrime helpline links (Dial **1930**, [cybercrime.gov.in](https://cybercrime.gov.in))

### Login / Signup
- JWT-based secure authentication
- Show/hide password toggle
- Password strength meter on signup
- Check history saved when logged in

### My Profile
- Account details and member since date
- Personal stats (checks, fake detected, reports submitted)
- **My Check History** — last 50 job checks

### About
- Project mission and how it works
- 6 safety tips in English + Telugu
- Official cybercrime helpline links

### Admin Panel (admin only)
- Manage users, reports, and predictions
- Update report status (pending / reviewed / resolved)
- System overview statistics

---

## How It Works

```
User pastes job text
        ↓
Telugu detected? → Translate to English
        ↓
TF-IDF + ML Model → FAKE or REAL score
        ↓
Regex red flag patterns checked
        ↓
Final verdict + confidence + explanation
        ↓
Result saved to database → shown to user
```

**Red flags detected include:**
- Pay to register / registration fee
- Guaranteed high income (₹50,000/month)
- WhatsApp only contact
- No interview needed
- Work from home guaranteed
- Telugu patterns: రిజిస్ట్రేషన్ ఫీజు, అనుభవం అక్కరలేదు, etc.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, React Router, CSS |
| **Backend** | FastAPI, Uvicorn, SQLAlchemy, SQLite |
| **Auth** | JWT (python-jose), bcrypt password hashing |
| **ML** | TF-IDF + Logistic Regression (scikit-learn) |
| **NLP** | deep-translator (Telugu→English), langdetect, regex red flags |
| **Deploy** | GitHub, Render (Web Service + Static Site) |

---

## Quick Start (Local)

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
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

Open **http://localhost:5173**

### Default Admin

| Field | Value |
|-------|-------|
| Email | `admin@jobguard.app` |
| Password | `admin123` |

Change via `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/predict` | Classify a job posting |
| `GET` | `/stats` | Dashboard statistics |
| `POST` | `/report` | Submit a scam report |
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/login` | Login |
| `GET` | `/auth/me` | Current user profile |
| `GET` | `/auth/me/stats` | User's personal stats |
| `GET` | `/auth/me/history` | User's check history |
| `GET` | `/admin/*` | Admin routes (JWT + admin role) |

---

## Deploy to Render

1. Push this repo to GitHub
2. Sign up at [render.com](https://render.com) with GitHub
3. Create a **Blueprint** from `render.yaml`

**Backend (`jobguard-api`)**

| Setting | Value |
|---------|-------|
| Root | `backend` |
| Build | `pip install -r requirements.txt && python train_model.py` |
| Start | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| `CORS_ORIGINS` | Your frontend URL |
| `ADMIN_PASSWORD` | Strong password |

**Frontend (`jobguard-frontend`)**

| Setting | Value |
|---------|-------|
| Root | `frontend` |
| Build | `npm install && npm run build` |
| Publish | `dist` |
| `VITE_API_URL` | Your backend URL (e.g. `https://jobguard-api.onrender.com`) |

Live site: **https://jobguard-frontend.onrender.com**

---

## Project Structure

```
jobguard/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── auth.py          # JWT & password helpers
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic request/response models
│   │   ├── ml/              # Classifier, red flags, translator
│   │   └── routers/         # API routes (auth, predict, reports, stats, admin)
│   ├── train_model.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/           # Checker, Dashboard, Report, Login, Profile, About, Admin
│   │   ├── components/      # Nav, Footer, ConnectionError, HelplineBanner
│   │   ├── context/         # AuthContext
│   │   └── utils/           # WhatsApp share, password strength
│   └── package.json
├── render.yaml
└── README.md
```

---

## License

MIT

---

## Author

**Sai Jahnavi Madana** — Community Service Project
