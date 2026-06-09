"""Unit tests for JobGuard ML classifier and red flag detector."""
import pytest
from app.ml.classifier import predict_job
from app.ml.red_flags import detect_red_flags


# ── Red Flag Tests ──────────────────────────────────────────

def test_registration_fee_detected():
    flags = detect_red_flags("Pay ₹500 registration fee to start.")
    assert "Registration fee" in flags

def test_no_experience_detected():
    flags = detect_red_flags("No experience required. Join now.")
    assert "No experience required" in flags

def test_whatsapp_only_detected():
    flags = detect_red_flags("WhatsApp only for details.")
    assert "WhatsApp only" in flags

def test_guaranteed_income_detected():
    flags = detect_red_flags("Guaranteed income ₹50000 monthly.")
    assert "Guaranteed income" in flags

def test_no_interview_detected():
    flags = detect_red_flags("No interview needed. Direct joining.")
    assert "No interview needed" in flags

def test_mlm_detected():
    flags = detect_red_flags("MLM opportunity. Join and earn unlimited.")
    assert "MLM scheme" in flags

def test_telugu_registration_fee_detected():
    flags = detect_red_flags("రిజిస్ట్రేషన్ ఫీజు చెల్లించండి.")
    assert "Registration fee (Telugu)" in flags

def test_telugu_no_experience_detected():
    flags = detect_red_flags("అనుభవం అక్కరలేదు. వెంటనే జాయిన్ అవ్వండి.")
    assert "No experience (Telugu)" in flags

def test_real_job_no_red_flags():
    flags = detect_red_flags("TCS hiring Software Engineer. B.Tech required. Apply on TCS careers portal.")
    assert len(flags) == 0

def test_joining_fee_detected():
    flags = detect_red_flags("Pay joining fee ₹300 immediately.")
    assert "Joining fee" in flags

def test_send_money_first_detected():
    flags = detect_red_flags("Send money first to get the kit.")
    assert "Send money first" in flags

def test_urgent_job_detected():
    flags = detect_red_flags("Urgent job! Apply now immediately.")
    assert "Urgent job" in flags


# ── Classifier Tests ────────────────────────────────────────

def test_obvious_fake_detected():
    result = predict_job("Urgent!! Pay ₹500 registration fee. No experience needed. Guaranteed ₹50000 monthly. WhatsApp now!")
    assert result["label"] == "FAKE"

def test_obvious_real_detected():
    result = predict_job("TCS is hiring Software Engineer in Bangalore. B.Tech required. 2 years experience. Apply on TCS careers website.")
    assert result["label"] == "REAL"

def test_result_has_confidence():
    result = predict_job("Work from home job. Earn daily guaranteed.")
    assert "confidence" in result
    assert 0 <= result["confidence"] <= 100

def test_result_has_label():
    result = predict_job("Some job posting text here.")
    assert result["label"] in ["FAKE", "REAL"]

def test_result_has_red_flags():
    result = predict_job("Pay ₹500 registration fee. No experience required.")
    assert "red_flags" in result
    assert isinstance(result["red_flags"], list)

def test_fake_probability_range():
    result = predict_job("Earn ₹5000 daily guaranteed. No experience. Pay fee now.")
    assert 0 <= result["fake_probability"] <= 100
    assert 0 <= result["real_probability"] <= 100

def test_probabilities_sum_to_100():
    result = predict_job("Software Developer job. B.Tech required. Apply online.")
    total = result["fake_probability"] + result["real_probability"]
    assert abs(total - 100) < 1

def test_telugu_fake_detected():
    result = predict_job("అర్జెంట్ జాబ్! రోజుకు ₹2000 గ్యారంటీ. అనుభవం అక్కరలేదు. ₹300 చెల్లించండి.")
    assert result["label"] == "FAKE"

def test_multiple_red_flags_boost():
    result1 = predict_job("Work from home job.")
    result2 = predict_job("Urgent! Pay ₹500 fee. No experience. No interview. Guaranteed ₹50000. WhatsApp now!")
    assert result2["fake_probability"] > result1["fake_probability"]

def test_empty_text_handled():
    result = predict_job("job")
    assert result["label"] in ["FAKE", "REAL"]
