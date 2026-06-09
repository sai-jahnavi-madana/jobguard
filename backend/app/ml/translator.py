import re

from deep_translator import GoogleTranslator
from langdetect import LangDetectException, detect


def contains_telugu(text: str) -> bool:
    return bool(re.search(r"[\u0C00-\u0C7F]", text))


def detect_language(text: str) -> str:
    try:
        return detect(text)
    except LangDetectException:
        return "en"


def translate_to_english(text: str) -> tuple[str, bool]:
    """Returns (processed_text, was_translated)."""
    if contains_telugu(text) or detect_language(text) == "te":
        try:
            translated = GoogleTranslator(source="auto", target="en").translate(text)
            return translated, True
        except Exception:
            return text, False
    return text, False
