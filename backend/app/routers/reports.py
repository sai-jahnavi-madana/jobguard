from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Report, User
from app.schemas import ReportCreate, ReportSubmitResponse

router = APIRouter(tags=["reports"])


@router.post("/report", response_model=ReportSubmitResponse)
def submit_report(
    payload: ReportCreate,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_current_user),
):
    report = Report(
        text=payload.text,
        company=payload.company,
        city=payload.city,
        user_id=user.id if user else None,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return ReportSubmitResponse(success=True, id=report.id)
