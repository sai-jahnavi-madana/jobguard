from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.auth import hash_password
from app.models import User
from app.ml.classifier import train_and_save
from app.routers import admin, auth, predict, reports, stats

app = FastAPI(title=settings.app_name, version="1.0.0")

origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=bool(origins),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(stats.router)
app.include_router(reports.router)
app.include_router(admin.router)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    train_and_save()

    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == settings.admin_email.lower()).first()
        if not admin_user:
            db.add(User(
                email=settings.admin_email.lower(),
                name="Admin",
                hashed_password=hash_password(settings.admin_password),
                is_admin=True,
            ))
            db.commit()
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok", "service": settings.app_name}
