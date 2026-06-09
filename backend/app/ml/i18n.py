RED_FLAG_TE: dict[str, str] = {
    "Pay to register": "రిజిస్ట్రేషన్ కోసం చెల్లించాలి",
    "Registration fee": "రిజిస్ట్రేషన్ ఫీజు",
    "No experience required": "అనుభవం అక్కరలేదు",
    "No interview needed": "ఇంటర్వ్యూ అవసరం లేదు",
    "Guaranteed income": "గ్యారంటీడ్ ఆదాయం",
    "Earn daily guaranteed": "రోజుకు గ్యారంటీడ్ సంపాదన",
    "WhatsApp only": "WhatsApp మాత్రమే",
    "Work from home guaranteed": "ఇంటి నుండి పని — గ్యారంటీ",
    "Urgent job": "అర్జెంట్ జాబ్",
    "100% genuine claim": "100% నిజమని చెప్పడం",
    "No documents needed": "డాక్యుమెంట్లు అవసరం లేదు",
    "MLM scheme": "MLM స్కీమ్",
    "Processing fee": "ప్రాసెసింగ్ ఫీజు",
    "Immediate payment": "వెంటనే చెల్లింపు",
    "Unrealistic salary": "అవాస్తవ జీతం",
    "Telegram only": "Telegram మాత్రమే",
    "Send money first": "ముందుగా డబ్బు పంపాలి",
    "Registration fee (Telugu)": "రిజిస్ట్రేషన్ ఫీజు",
    "No experience (Telugu)": "అనుభవం అక్కరలేదు",
    "Guaranteed income (Telugu)": "గ్యారంటీడ్ ఆదాయం",
    "Urgent (Telugu)": "అర్జెంట్",
    "Work from home (Telugu)": "ఇంటి నుండి పని",
}


def localize_red_flags(flags: list[str], language: str) -> list[str]:
    if language != "te":
        return flags
    return [RED_FLAG_TE.get(f, f) for f in flags]


RESULT_MESSAGES = {
    "en": {
        "fake_title": "FAKE JOB ALERT",
        "real_title": "LOOKS LEGITIMATE",
        "fake_advice": "Do not apply or pay any fee",
        "real_advice": "Exercise normal caution",
        "confidence": "confidence",
        "red_flags_title": "Red Flags Detected",
        "no_flags": "No suspicious phrases detected. Still verify the company independently before sharing personal details.",
        "translation_note": "Telugu text detected — translated to English before classification",
        "translation_label": "Translation",
        "share_whatsapp": "Share on WhatsApp",
        "language": "Language",
        "fake_label": "FAKE",
        "real_label": "REAL",
    },
    "te": {
        "fake_title": "నకిలీ జాబ్ అలర్ట్",
        "real_title": "నమకదగిన జాబ్‌గా కనిపిస్తోంది",
        "fake_advice": "దరఖాస్తు చేయకండి, ఎటువంటి ఫీజు చెల్లించకండి",
        "real_advice": "సాధారణ జాగ్రత్తలు పాటించండి",
        "confidence": "విశ్వాసం",
        "red_flags_title": "అనుమానాస్పద సంకేతాలు",
        "no_flags": "అనుమానాస్పద పదబంధాలు కనుగొనబడలేదు. వ్యక్తిగత వివరాలు ఇవ్వే ముందు కంపెనీని స్వతంత్రంగా ధృవీకరించండి.",
        "translation_note": "తెలుగు టెక్స్ట్ గుర్తించబడింది — వర్గీకరణ కోసం ఆంగ్లంలోకి మార్చబడింది",
        "translation_label": "అనువాదం",
        "share_whatsapp": "WhatsApp లో షేర్ చేయండి",
        "language": "భాష",
        "fake_label": "నకిలీ",
        "real_label": "నిజమైనది",
    },
}


def get_messages(language: str) -> dict[str, str]:
    return RESULT_MESSAGES.get(language, RESULT_MESSAGES["en"])
