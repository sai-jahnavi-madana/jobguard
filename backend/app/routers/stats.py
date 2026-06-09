import json
from collections import Counter

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Prediction, Report
from app.schemas import FlagStat, StatsResponse

router = APIRouter(tags=["stats"])


@router.get("/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    predictions = db.query(Prediction).all()
    reports = db.query(Report).all()

    total = len(predictions)
    fake = sum(1 for p in predictions if p.label == "FAKE")
    real = sum(1 for p in predictions if p.label == "REAL")

    flag_counter: Counter[str] = Counter()
    for p in predictions:
        flags = json.loads(p.red_flags or "[]")
        flag_counter.update(flags)

    top_flags = [
        FlagStat(flag=f, count=c)
        for f, c in flag_counter.most_common(10)
    ]

    city_wise: dict[str, int] = Counter()
    for r in reports:
        if r.city:
            city_wise[r.city.strip().title()] += 1

    return StatsResponse(
        total_checked=total,
        fake_detected=fake,
        real_detected=real,
        reports_submitted=len(reports),
        top_red_flags=top_flags,
        city_wise=dict(city_wise),
    )
