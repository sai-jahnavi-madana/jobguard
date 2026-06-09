import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import create_access_token, hash_password, require_user, verify_password
from app.config import settings
from app.database import get_db
from app.models import Prediction, Report, User
from app.schemas import (
    PredictionHistoryItem,
    Token,
    UserCreate,
    UserLogin,
    UserOut,
    UserStatsResponse,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=Token)
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    is_admin = payload.email.lower() == settings.admin_email.lower()
    user = User(
        email=payload.email.lower(),
        name=payload.name,
        hashed_password=hash_password(payload.password),
        is_admin=is_admin,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id})
    return Token(
        access_token=token,
        user=UserOut.model_validate(user),
    )


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    token = create_access_token({"sub": user.id})
    return Token(
        access_token=token,
        user=UserOut.model_validate(user),
    )


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(require_user)):
    return UserOut.model_validate(user)


@router.get("/me/stats", response_model=UserStatsResponse)
def my_stats(user: User = Depends(require_user), db: Session = Depends(get_db)):
    checks = db.query(Prediction).filter(Prediction.user_id == user.id)
    return UserStatsResponse(
        total_checks=checks.count(),
        fake_detected=checks.filter(Prediction.label == "FAKE").count(),
        real_detected=checks.filter(Prediction.label == "REAL").count(),
        reports_submitted=db.query(Report).filter(Report.user_id == user.id).count(),
    )


@router.get("/me/history", response_model=list[PredictionHistoryItem])
def my_history(user: User = Depends(require_user), db: Session = Depends(get_db)):
    rows = (
        db.query(Prediction)
        .filter(Prediction.user_id == user.id)
        .order_by(Prediction.created_at.desc())
        .limit(50)
        .all()
    )
    return [
        PredictionHistoryItem(
            id=p.id,
            text=p.text[:200] + ("..." if len(p.text) > 200 else ""),
            label=p.label,
            confidence=p.confidence,
            fake_probability=p.fake_probability,
            real_probability=p.real_probability,
            red_flags_count=len(json.loads(p.red_flags or "[]")),
            created_at=p.created_at,
        )
        for p in rows
    ]
