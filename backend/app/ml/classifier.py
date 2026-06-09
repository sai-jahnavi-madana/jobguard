import json
from pathlib import Path

import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

from app.ml.i18n import get_messages, localize_red_flags
from app.ml.red_flags import detect_red_flags
from app.ml.translator import contains_telugu, translate_to_english

MODEL_PATH = Path(__file__).parent / "model.joblib"

# Training corpus — fake vs real job postings (English + Telugu transliterated)
TRAINING_DATA: list[tuple[str, int]] = [
    # FAKE (label=1)
    ("Urgent!! Work from home job. Earn ₹50000 per month guaranteed. No experience required. No interview. Pay ₹500 registration fee to start immediately. WhatsApp now!", 1),
    ("Earn ₹2000 daily from home. 100% genuine. No documents needed. Send registration fee ₹300 via PhonePe. Contact on Telegram.", 1),
    ("Part time job! Guaranteed income ₹30000/month. No experience. Pay advance fee ₹1000. WhatsApp only.", 1),
    ("MLM opportunity! Earn unlimited money. Join now pay ₹500. No interview needed. Work from home guaranteed.", 1),
    ("Immediate joining! Data entry work from home. Earn ₹1500 per day guaranteed. Registration fee required.", 1),
    ("అర్జెంట్ జాబ్! ఇంట్లో నుండి పని చేయండి. రోజుకు ₹2000 గ్యారంటీ. అనుభవం అక్కరలేదు. రిజిస్ట్రేషన్ ₹300 చెల్లించండి. వెంటనే WhatsApp చేయండి!", 1),
    ("ఇంటి నుండి పని. నెలకు ₹40000 సంపాదించండి. ఎలాంటి అనుభవం అక్కరలేదు. ఫీజు చెల్లించి వెంటనే జాయిన్ అవ్వండి.", 1),
    ("No interview work from home. Guaranteed ₹60000 monthly. Pay processing fee. 100% genuine opportunity.", 1),
    ("Typing job from home. Earn daily guaranteed. Send money first for kit. WhatsApp me now urgent.", 1),
    ("Amazon work from home fake. Registration ₹999. No experience ₹50k salary guaranteed.", 1),
    # REAL (label=0)
    ("Software Developer at Wipro, Hyderabad. B.Tech CSE required. 2-4 years Java Spring Boot experience. CTC 8-12 LPA. Apply through Wipro careers portal.", 0),
    ("TCS is hiring Software Engineer in Bangalore. B.E/B.Tech with 1-3 years experience in Python and cloud. Apply on TCS careers website.", 0),
    ("Infosys campus drive for freshers. B.Tech 2024 batch. Aptitude and technical interview rounds. Register on Infosys careers.", 0),
    ("Senior Data Analyst at Deloitte Hyderabad. 3+ years SQL and Power BI. MBA preferred. Apply via LinkedIn or company portal.", 0),
    ("TCS హైదరాబాద్‌లో సాఫ్ట్‌వేర్ ఇంజనీర్ పోస్ట్. B.Tech అవసరం. 2 సంవత్సరాల అనుభవం. జీతం 7-9 LPA. TCS కెరీర్స్ వెబ్‌సైట్‌లో దరఖాస్తు చేయండి.", 0),
    ("Accenture hiring Full Stack Developer. React and Node.js. 2-5 years experience. Interview process includes technical and HR rounds. CTC negotiable.", 0),
    ("HCL Technologies recruitment for Java Developer. Hyderabad office. B.Tech with 2+ years. Apply through official HCL careers page.", 0),
    ("Microsoft India hiring SDE. Bangalore. CS degree required. Multiple interview rounds. Competitive compensation package.", 0),
    ("Capgemini walk-in drive for experienced professionals. Bring resume and ID proof. Technical interview on site.", 0),
    ("Product Manager at Flipkart. 4+ years PM experience. MBA from tier-1 institute preferred. Apply on Flipkart careers.", 0),
]


def _build_pipeline() -> Pipeline:
    return Pipeline([
        ("tfidf", TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 2),
            stop_words="english",
            sublinear_tf=True,
        )),
        ("clf", LogisticRegression(max_iter=1000, class_weight="balanced")),
    ])


def train_and_save() -> None:
    texts = [t for t, _ in TRAINING_DATA]
    labels = [l for _, l in TRAINING_DATA]
    pipeline = _build_pipeline()
    pipeline.fit(texts, labels)
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)


def _load_model() -> Pipeline:
    if not MODEL_PATH.exists():
        train_and_save()
    return joblib.load(MODEL_PATH)


_model: Pipeline | None = None


def get_model() -> Pipeline:
    global _model
    if _model is None:
        _model = _load_model()
    return _model


def predict_job(text: str) -> dict:
    is_telugu = contains_telugu(text)
    processed, was_translated = translate_to_english(text)
    detected_language = "te" if (is_telugu or was_translated) else "en"

    red_flags_en = detect_red_flags(text)
    if was_translated:
        red_flags_en = list(set(red_flags_en + detect_red_flags(processed)))
    red_flags_te = localize_red_flags(red_flags_en, "te")

    model = get_model()
    proba = model.predict_proba([processed])[0]
    fake_prob = float(proba[1]) * 100
    real_prob = float(proba[0]) * 100

    # Boost fake score if red flags present
    if red_flags_en:
        boost = min(len(red_flags_en) * 8, 30)
        fake_prob = min(fake_prob + boost, 99)
        real_prob = 100 - fake_prob

    label = "FAKE" if fake_prob >= 50 else "REAL"
    confidence = fake_prob if label == "FAKE" else real_prob

    return {
        "label": label,
        "confidence": round(confidence, 1),
        "fake_probability": round(fake_prob, 1),
        "real_probability": round(real_prob, 1),
        "red_flags": red_flags_en,
        "red_flags_en": red_flags_en,
        "red_flags_te": red_flags_te,
        "was_translated": was_translated,
        "translated_text": processed if was_translated else None,
        "detected_language": detected_language,
        "messages": {"en": get_messages("en"), "te": get_messages("te")},
    }
