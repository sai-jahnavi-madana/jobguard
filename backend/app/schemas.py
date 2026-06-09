from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class UserStatsResponse(BaseModel):
    total_checks: int
    fake_detected: int
    real_detected: int
    reports_submitted: int


class PredictionHistoryItem(BaseModel):
    id: int
    text: str
    label: str
    confidence: float
    fake_probability: float
    real_probability: float
    red_flags_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class PredictRequest(BaseModel):
    text: str = Field(min_length=10, max_length=10000)


class PredictResponse(BaseModel):
    label: str
    confidence: float
    fake_probability: float
    real_probability: float
    red_flags: list[str]
    red_flags_en: list[str] = []
    red_flags_te: list[str] = []
    was_translated: bool
    translated_text: str | None = None
    detected_language: str = "en"
    messages: dict[str, dict[str, str]] = {}


class ReportCreate(BaseModel):
    text: str = Field(min_length=10, max_length=10000)
    company: str | None = None
    city: str | None = None


class ReportOut(BaseModel):
    id: int
    text: str
    company: str | None
    city: str | None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class ReportSubmitResponse(BaseModel):
    success: bool
    id: int


class FlagStat(BaseModel):
    flag: str
    count: int


class StatsResponse(BaseModel):
    total_checked: int
    fake_detected: int
    real_detected: int
    reports_submitted: int
    top_red_flags: list[FlagStat]
    city_wise: dict[str, int]


class AdminStats(BaseModel):
    total_users: int
    total_predictions: int
    total_reports: int
    pending_reports: int


class ReportStatusUpdate(BaseModel):
    status: str = Field(pattern="^(pending|reviewed|resolved)$")
