import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.ml.classifier import predict_job
from app.models import Prediction, User
from app.schemas import PredictRequest, PredictResponse

router = APIRouter(tags=["predict"])


@router.post("/predict", response_model=PredictResponse)
def predict(
    payload: PredictRequest,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_current_user),
):
    result = predict_job(payload.text)

    record = Prediction(
        text=payload.text[:2000],
        label=result["label"],
        confidence=result["confidence"],
        fake_probability=result["fake_probability"],
        real_probability=result["real_probability"],
        red_flags=json.dumps(result["red_flags"]),
        was_translated=result["was_translated"],
        translated_text=result.get("translated_text"),
        user_id=user.id if user else None,
    )
    db.add(record)
    db.commit()

    return PredictResponse(**result)
