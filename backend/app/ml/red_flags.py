import re

RED_FLAG_PATTERNS: list[tuple[str, str]] = [
    (r"(?i)pay\s*(to\s*)?(register|registration|fee|fees|advance)", "Pay to register"),
    (r"(?i)registration\s*fee", "Registration fee"),
    (r"(?i)no\s*experience\s*(required|needed)?", "No experience required"),
    (r"(?i)no\s*interview", "No interview needed"),
    (r"(?i)guaranteed?\s*(income|salary|earning|money|₹|rs\.?)", "Guaranteed income"),
    (r"(?i)earn\s*(₹|rs\.?|daily|per\s*day)", "Earn daily guaranteed"),
    (r"(?i)whatsapp\s*(only|now|me|number)?", "WhatsApp only"),
    (r"(?i)work\s*from\s*home\s*(guaranteed|job)?", "Work from home guaranteed"),
    (r"(?i)urgent\s*job", "Urgent job"),
    (r"(?i)100\s*%\s*(genuine|real|legit)", "100% genuine claim"),
    (r"(?i)no\s*documents?\s*(required|needed)?", "No documents needed"),
    (r"(?i)mlm|multi\s*level", "MLM scheme"),
    (r"(?i)processing\s*fee|security\s*deposit", "Processing fee"),
    (r"(?i)immediate\s*(joining|start|payment)", "Immediate payment"),
    (r"(?i)₹\s*\d{4,}\s*(per\s*(day|month)|guaranteed)", "Unrealistic salary"),
    (r"(?i)telegram\s*(only|group|channel)", "Telegram only"),
    (r"(?i)send\s*(money|payment|fee)\s*first", "Send money first"),
    # Telugu patterns (transliterated / common scam phrases)
    (r"రిజిస్ట్రేషన్|ఫీజు|చెల్లించ", "Registration fee (Telugu)"),
    (r"అనుభవం\s*అక్కరలేదు", "No experience (Telugu)"),
    (r"గ్యారంటీ|నిర్ధారిత", "Guaranteed income (Telugu)"),
    (r"వెంటనే|అర్జెంట్", "Urgent (Telugu)"),
    (r"ఇంట్లో\s*నుండి\s*పని", "Work from home (Telugu)"),
]


def detect_red_flags(text: str) -> list[str]:
    flags: list[str] = []
    for pattern, label in RED_FLAG_PATTERNS:
        if re.search(pattern, text):
            if label not in flags:
                flags.append(label)
    return flags
