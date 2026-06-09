import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import require_admin
from app.database import get_db
from app.models import Prediction, Report, User
from app.schemas import AdminStats, ReportOut, ReportStatusUpdate, UserOut

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats", response_model=AdminStats)
def admin_stats(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return AdminStats(
        total_users=db.query(User).count(),
        total_predictions=db.query(Prediction).count(),
        total_reports=db.query(Report).count(),
        pending_reports=db.query(Report).filter(Report.status == "pending").count(),
    )


@router.get("/users", response_model=list[UserOut])
def list_users(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return [UserOut.model_validate(u) for u in db.query(User).order_by(User.created_at.desc()).all()]


@router.get("/reports", response_model=list[ReportOut])
def list_reports(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    return [ReportOut.model_validate(r) for r in db.query(Report).order_by(Report.created_at.desc()).all()]


@router.patch("/reports/{report_id}", response_model=ReportOut)
def update_report_status(
    report_id: int,
    payload: ReportStatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report.status = payload.status
    db.commit()
    db.refresh(report)
    return ReportOut.model_validate(report)


@router.get("/predictions")
def list_predictions(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
    limit: int = 50,
):
    rows = db.query(Prediction).order_by(Prediction.created_at.desc()).limit(limit).all()
    return [
        {
            "id": p.id,
            "text": p.text[:200] + ("..." if len(p.text) > 200 else ""),
            "label": p.label,
            "confidence": p.confidence,
            "red_flags": json.loads(p.red_flags or "[]"),
            "was_translated": p.was_translated,
            "created_at": p.created_at.isoformat(),
        }
        for p in rows
    ]


@router.delete("/reports/{report_id}")
def delete_report(
    report_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(report)
    db.commit()
    return {"success": True}
