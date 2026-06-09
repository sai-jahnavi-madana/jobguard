# JobGuard — Fake Job Alert Detection System

> Detects fake job postings using machine learning with Telugu + English language support.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## Overview

JobGuard helps job seekers identify fraudulent job postings. Users paste any job description — in Telugu or English — and receive an instant **FAKE / REAL** verdict with a confidence score and a list of detected red flags.

The system uses a TF-IDF + Logistic Regression classifier trained on labeled job postings, combined with regex-based red flag detection and automatic Telugu-to-English translation.

---

## Features

- **Job Checker** — Paste a job posting and get a FAKE/REAL verdict with confidence score
- **Dashboard** — Live statistics, top red flags, and city-wise scam reports
- **Report** — Submit job postings that the model missed
- **Authentication** — JWT-based login and signup
- **Admin Panel** — Manage users, reports, and predictions (admin role required)
- **Telugu Support** — Automatically translates Telugu postings before analysis

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + React Router |
| Backend | FastAPI + SQLite + SQLAlchemy |
| Authentication | JWT (JSON Web Tokens) |
| ML Model | TF-IDF Vectorizer + Logistic Regression |
| NLP | deep-translator (Telugu → English), regex red flag rules |
| Deployment | Render (Web Service + Static Site) |

---

## Project Structure

```
jobguard/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── auth.py              # JWT helpers and password hashing
│   │   ├── models.py            # SQLAlchemy database models
│   │   ├── ml/
│   │   │   ├── classifier.py    # TF-IDF + Logistic Regression model
│   │   │   ├── red_flags.py     # Regex-based red flag detection
│   │   │   └── translator.py    # Telugu to English translation
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
│   │   │   ├── Checker.jsx      # Job classifier UI
│   │   │   ├── Dashboard.jsx    # Stats and charts
│   │   │   ├── Report.jsx       # Submit scam report
│   │   │   ├── Login.jsx
│   │   │   └── Admin.jsx
│   │   ├── components/
│   │   │   └── Nav.jsx
│   │   └── context/
│   │       └── AuthContext.jsx
│   └── package.json
│
└── render.yaml
```

---

## Getting Started

### Prerequisites

- Python 3.9 or higher
- Node.js 18 or higher

### 1. Clone the repository

```bash
git clone https://github.com/your-username/jobguard.git
cd jobguard
```

### 2. Run the backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS / Linux

# Install dependencies and train the model
pip install -r requirements.txt
python train_model.py

# Start the server
uvicorn app.main:app --reload --port 8000
```

Backend runs at `http://localhost:8000`  
API docs available at `http://localhost:8000/docs`

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### Default admin credentials

| Field | Value |
|---|---|
| Email | `admin@jobguard.app` |
| Password | `admin123` |

Override these with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables before deploying.

---

## API Reference

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/predict` | No | Classify a job posting |
| GET | `/stats` | No | Get dashboard statistics |
| POST | `/report` | JWT | Submit a scam report |
| POST | `/auth/signup` | No | Register a new user |
| POST | `/auth/login` | No | Login and receive a JWT |
| GET | `/auth/me` | JWT | Get current user details |
| GET | `/admin/*` | JWT + Admin | Admin-only routes |

### Example request

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Urgent hiring! Work from home. No experience needed. Pay ₹500 registration fee."}'
```

### Example response

```json
{
  "verdict": "FAKE",
  "confidence": 0.94,
  "red_flags": [
    "pay registration fee",
    "no experience needed",
    "urgent hiring"
  ]
}
```

---

## Deployment

This project deploys to [Render](https://render.com) using two services — a backend Web Service and a frontend Static Site.

### Option A — Blueprint (recommended)

1. Push the repository to GitHub
2. Go to Render Dashboard → **New → Blueprint**
3. Connect your repository — Render reads `render.yaml` and creates both services automatically

### Option B — Manual setup

**Backend — Web Service**

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt && python train_model.py` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

**Frontend — Static Site**

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

After deploying, set `CORS_ORIGINS` on the backend to include your frontend URL.

---

## Environment Variables

### Backend

| Variable | Required | Description |
|---|---|---|
| `SECRET_KEY` | Yes | Secret key for signing JWTs |
| `CORS_ORIGINS` | Yes | Allowed frontend origin, e.g. `https://jobguard.onrender.com` |
| `ADMIN_EMAIL` | No | Override default admin email |
| `ADMIN_PASSWORD` | No | Override default admin password |

### Frontend

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend base URL, e.g. `https://jobguard-api.onrender.com` |

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
