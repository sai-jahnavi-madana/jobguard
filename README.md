<div align="center">

<img src="https://img.shields.io/badge/JobGuard-v1.0-FF3B3B?style=for-the-badge&logo=shield&logoColor=white" alt="JobGuard"/>

# 🛡️ JobGuard
### Fake Job Alert Detection System

**AI-powered. Telugu + English. Real-time red flag analysis.**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Deploy on Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://render.com)

</div>

---

## 🔍 What is JobGuard?

JobGuard protects job seekers from fraudulent postings by analyzing job descriptions using machine learning and NLP. Paste any job alert — in **Telugu or English** — and get an instant **FAKE / REAL verdict** with a confidence score and detailed red flag breakdown.

> Built especially for Indian job seekers where WhatsApp-forwarded scam jobs are rampant.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔎 **Job Checker** | Paste any job posting → instant FAKE/REAL verdict with confidence score |
| 📊 **Live Dashboard** | Real-time stats, top red flags, city-wise scam heat map |
| 🚨 **Report a Scam** | Submit undetected fraudulent listings for review |
| 🔐 **Auth** | JWT-based login & signup |
| 🛠️ **Admin Panel** | Manage users, reports, and ML predictions (admin only) |
| 🌐 **Telugu NLP** | Auto-translates Telugu job postings before analysis |

---

## 🧠 How It Works

```
User pastes job posting
        │
        ▼
┌───────────────────┐
│  Telugu Detector  │  ← deep-translator (if Telugu detected)
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Red Flag Regex   │  ← "no experience needed", "pay fee", "urgent hiring" …
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  TF-IDF + LogReg  │  ← trained ML classifier
└────────┬──────────┘
         │
         ▼
  FAKE / REAL verdict
  + confidence score
  + flagged phrases
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite + React Router |
| **Backend** | FastAPI + SQLite + SQLAlchemy |
| **Auth** | JWT (JSON Web Tokens) |
| **ML Model** | TF-IDF Vectorizer + Logistic Regression |
| **NLP** | `deep-translator` for Telugu → English, regex red flag rules |
| **Deploy** | Render (Web Service + Static Site) |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1 — Clone the repo

```bash
git clone https://github.com/your-username/jobguard.git
cd jobguard
```

### 2 — Backend setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
python train_model.py
uvicorn app.main:app --reload --port 8000
```

Backend runs at → `http://localhost:8000`
Interactive API docs → `http://localhost:8000/docs`

### 3 — Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

## 🔑 Default Admin Account

| Field | Value |
|---|---|
| Email | `admin@jobguard.app` |
| Password | `admin123` |

> ⚠️ Change these in production via `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables.

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/predict` | Optional | Classify a job posting |
| `GET` | `/stats` | — | Dashboard statistics |
| `POST` | `/report` | JWT | Submit a scam report |
| `POST` | `/auth/signup` | — | Register new user |
| `POST` | `/auth/login` | — | Login, receive JWT |
| `GET` | `/auth/me` | JWT | Get current user info |
| `GET` | `/admin/*` | JWT + Admin | All admin routes |

### Example — Classify a job posting

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Urgent hiring! Work from home. No experience needed. Pay ₹500 registration fee."}'
```

```json
{
  "verdict": "FAKE",
  "confidence": 0.94,
  "red_flags": ["pay registration fee", "no experience needed", "urgent hiring"]
}
```

---

## 🗂️ Project Structure

```
jobguard/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app entry point
│   │   ├── auth.py            # JWT helpers & password hashing
│   │   ├── models.py          # SQLAlchemy DB models
│   │   ├── ml/
│   │   │   ├── classifier.py  # TF-IDF + Logistic Regression
│   │   │   ├── red_flags.py   # Regex-based red flag rules
│   │   │   └── translator.py  # Telugu → English translation
│   │   └── routers/
│   │       ├── predict.py
│   │       ├── stats.py
│   │       ├── report.py
│   │       ├── auth.py
│   │       └── admin.py
│   ├── train_model.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Checker.jsx    # Job posting classifier UI
│   │   │   ├── Dashboard.jsx  # Live stats & charts
│   │   │   ├── Report.jsx     # Submit scam report
│   │   │   ├── Login.jsx
│   │   │   └── Admin.jsx
│   │   ├── components/
│   │   │   └── Nav.jsx
│   │   └── context/
│   │       └── AuthContext.jsx
│   ├── package.json
│   └── vite.config.js
│
├── render.yaml                # Render deployment config
└── README.md
```

---

## ☁️ Deploy to Render

### Option A — One-click via Blueprint

1. Push this repo to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com) → **New → Blueprint**
3. Connect your repo — Render auto-reads `render.yaml` and creates both services

### Option B — Manual setup

**Backend (Web Service)**

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt && python train_model.py` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Env vars | `SECRET_KEY`, `CORS_ORIGINS`, `ADMIN_PASSWORD` |

**Frontend (Static Site)**

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| Env vars | `VITE_API_URL=https://jobguard-api.onrender.com` |

> 📌 Make sure `CORS_ORIGINS` on the backend includes your frontend URL.

---

## 🌐 Environment Variables

### Backend

| Variable | Required | Description |
|---|---|---|
| `SECRET_KEY` | ✅ | JWT signing secret (use a long random string) |
| `CORS_ORIGINS` | ✅ | Comma-separated allowed origins, e.g. `https://jobguard.onrender.com` |
| `ADMIN_EMAIL` | ⬜ | Override default admin email |
| `ADMIN_PASSWORD` | ⬜ | Override default admin password |

### Frontend

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ | Backend base URL |

---

## 🔮 Roadmap

- [ ] WhatsApp job message paste support
- [ ] Browser extension for inline detection
- [ ] Crowd-sourced scam database
- [ ] SMS alert integration
- [ ] More regional language support (Hindi, Tamil, Kannada)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m 'Add some feature'`
4. Push to the branch — `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ to protect Indian job seekers from online scams.

**Star ⭐ this repo if JobGuard helped you!**

</div>
