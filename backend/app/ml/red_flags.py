import re

RED_FLAG_PATTERNS: list[tuple[str, str]] = [
    # Payment red flags
    (r"(?i)pay\s*(to\s*)?(register|registration|fee|fees|advance)", "Pay to register"),
    (r"(?i)registration\s*fee", "Registration fee"),
    (r"(?i)processing\s*fee|security\s*deposit", "Processing fee"),
    (r"(?i)send\s*(money|payment|fee)\s*first", "Send money first"),
    (r"(?i)joining\s*fee", "Joining fee"),
    (r"(?i)activation\s*fee", "Activation fee"),
    (r"(?i)training\s*fee", "Training fee"),
    (r"(?i)deposit\s*(required|first|now|₹)", "Deposit required"),
    (r"(?i)pay\s*(₹|rs\.?)\s*\d+", "Pay money upfront"),
    (r"(?i)kit\s*fee|material\s*fee", "Kit/material fee"),
    (r"(?i)advance\s*payment|advance\s*fee", "Advance payment"),
    (r"(?i)visa\s*(processing\s*)?fee", "Visa processing fee"),
    (r"(?i)phonepay|phonepe|gpay|upi\s*(pay|send|transfer)", "UPI payment request"),
    (r"(?i)send\s*(via|through|on)\s*(phonepay|phonepe|gpay|paytm|upi)", "Send via payment app"),
    (r"(?i)bribe|bribery", "Bribe required"),

    # No experience/qualification red flags
    (r"(?i)no\s*experience\s*(required|needed)?", "No experience required"),
    (r"(?i)no\s*interview", "No interview needed"),
    (r"(?i)no\s*documents?\s*(required|needed)?", "No documents needed"),
    (r"(?i)no\s*qualification\s*(required|needed)?", "No qualification needed"),
    (r"(?i)no\s*(exam|test)\s*(required|needed)?", "No exam needed"),
    (r"(?i)without\s*(degree|qualification|experience|interview|exam)", "No qualification needed"),
    (r"(?i)fresher.*guaranteed|guaranteed.*fresher", "Guaranteed for freshers"),
    (r"(?i)any\s*(graduate|qualification)\s*(can\s*apply|eligible)", "Any qualification"),

    # Guaranteed income red flags
    (r"(?i)guaranteed?\s*(income|salary|earning|money|₹|rs\.?)", "Guaranteed income"),
    (r"(?i)earn\s*(₹|rs\.?|daily|per\s*day)", "Earn daily guaranteed"),
    (r"(?i)100\s*%\s*(genuine|real|legit|guaranteed|income)", "100% genuine claim"),
    (r"(?i)guaranteed\s*(job|work|payment|money)", "Guaranteed job/money"),
    (r"(?i)fixed\s*income\s*guaranteed", "Fixed income guaranteed"),
    (r"(?i)daily\s*(income|payment|earning)\s*guaranteed", "Daily income guaranteed"),
    (r"(?i)earn\s*(unlimited|lakhs|crores)\s*(monthly|daily)?", "Unrealistic earnings"),
    (r"(?i)₹\s*\d{4,}\s*(per\s*(day|month)|guaranteed|daily)", "Unrealistic salary"),
    (r"(?i)earn\s*₹\s*[5-9]\d{4,}", "Very high unrealistic salary"),

    # Contact method red flags
    (r"(?i)whatsapp\s*(only|now|me|number|immediately)?", "WhatsApp only"),
    (r"(?i)telegram\s*(only|group|channel|now)?", "Telegram only"),
    (r"(?i)contact\s*(on|via|through)\s*(whatsapp|telegram|instagram)", "Informal contact only"),
    (r"(?i)call\s*(now|immediately|urgent)\s*(whatsapp)?", "Urgent call now"),
    (r"(?i)dm\s*(now|immediately|for\s*details)", "DM now"),

    # Urgency red flags
    (r"(?i)urgent\s*(job|hiring|vacancy|requirement)", "Urgent job"),
    (r"(?i)immediate\s*(joining|start|payment|vacancy)", "Immediate joining"),
    (r"(?i)limited\s*(seats|vacancy|slots|offer)", "Limited seats"),
    (r"(?i)apply\s*(now|immediately|today|fast)", "Apply now urgently"),
    (r"(?i)last\s*(date|chance|opportunity)", "Last chance urgency"),
    (r"(?i)only\s*\d+\s*(seats|vacancies|slots)\s*(left|remaining|available)", "Limited seats"),
    (r"(?i)hurry|act\s*now|don't\s*miss", "Urgency pressure"),

    # Work from home scam patterns
    (r"(?i)work\s*from\s*home\s*(guaranteed|job|earn|₹)?", "Work from home guaranteed"),
    (r"(?i)online\s*(job|work|earning)\s*(from\s*home)?", "Online job from home"),
    (r"(?i)home\s*based\s*(job|work|business)", "Home based job"),
    (r"(?i)part\s*time\s*(job|work|earning)\s*(from\s*home)?", "Part time from home"),
    (r"(?i)mobile\s*(se|se\s*paise|earning|job)", "Mobile earning job"),
    (r"(?i)laptop\s*(se|job|earning|work)\s*(ghar\s*se)?", "Laptop job from home"),

    # MLM and pyramid schemes
    (r"(?i)mlm|multi\s*level\s*marketing", "MLM scheme"),
    (r"(?i)downline|upline|referral\s*income", "MLM referral scheme"),
    (r"(?i)network\s*marketing", "Network marketing"),
    (r"(?i)pyramid\s*scheme", "Pyramid scheme"),
    (r"(?i)chain\s*(marketing|business|job)", "Chain marketing"),
    (r"(?i)recruit\s*(members|people|friends)\s*(earn|income)", "Recruit and earn MLM"),

    # Fake government job red flags
    (r"(?i)government\s*job\s*(without|no)\s*(exam|test|interview)", "Fake govt job"),
    (r"(?i)railway\s*job\s*(without|no)\s*exam", "Fake railway job"),
    (r"(?i)bank\s*job\s*(without|no)\s*(exam|interview)", "Fake bank job"),
    (r"(?i)direct\s*(appointment|selection|joining)\s*(guaranteed)?", "Direct appointment scam"),
    (r"(?i)guaranteed\s*government\s*(job|selection|appointment)", "Guaranteed govt job scam"),

    # Fake foreign job red flags
    (r"(?i)foreign\s*(job|company|opportunity)\s*(no\s*experience)?", "Fake foreign job"),
    (r"(?i)abroad\s*(job|work|opportunity)\s*(guaranteed)?", "Abroad job scam"),
    (r"(?i)gulf\s*job\s*(no\s*experience|guaranteed|fee)?", "Gulf job scam"),
    (r"(?i)dubai\s*job\s*(no\s*experience|guaranteed|fee)?", "Dubai job scam"),
    (r"(?i)canada\s*job\s*(no\s*experience|guaranteed|fee)?", "Canada job scam"),

    # Miscellaneous scam patterns
    (r"(?i)no\s*(boss|target|pressure|work)", "No boss/target claim"),
    (r"(?i)easy\s*(money|income|job|work|earning)", "Easy money claim"),
    (r"(?i)simple\s*(job|task|work)\s*(earn|income|₹)", "Simple job earn"),
    (r"(?i)click\s*(and\s*earn|to\s*earn|earn)", "Click and earn scam"),
    (r"(?i)like\s*(and\s*earn|share\s*earn|subscribe\s*earn)", "Like and earn scam"),
    (r"(?i)lottery\s*(winner|won|prize|claim)", "Lottery scam"),
    (r"(?i)you\s*(have\s*)?(won|selected|chosen)\s*(₹|rs|prize|lottery)", "Prize winner scam"),
    (r"(?i)data\s*entry\s*(from\s*home|guaranteed|earn)", "Data entry scam"),
    (r"(?i)typing\s*(job|work)\s*(from\s*home|earn|guaranteed)", "Typing job scam"),
    (r"(?i)captcha\s*(job|work|typing|earn)", "Captcha job scam"),
    (r"(?i)copy\s*paste\s*(job|work|earn)", "Copy paste job scam"),
    (r"(?i)ad\s*posting\s*(job|work|earn)", "Ad posting job scam"),
    (r"(?i)form\s*fill(ing)?\s*(job|work|earn)", "Form filling job scam"),
    (r"(?i)survey\s*(job|work|earn|₹)", "Survey job scam"),
    (r"(?i)resell(ing)?\s*(job|earn|₹|guaranteed)", "Reselling job scam"),
    (r"(?i)assembl(y|ing)\s*(job|work)\s*(from\s*home|earn)", "Assembling job scam"),
    (r"(?i)packing\s*(job|work)\s*(from\s*home|earn|guaranteed)", "Packing job scam"),

    # Telugu patterns
    (r"రిజిస్ట్రేషన్|ఫీజు|చెల్లించ", "Registration fee (Telugu)"),
    (r"అనుభవం\s*అక్కరలేదు", "No experience (Telugu)"),
    (r"గ్యారంటీ|నిర్ధారిత", "Guaranteed income (Telugu)"),
    (r"వెంటనే|అర్జెంట్", "Urgent (Telugu)"),
    (r"ఇంట్లో\s*నుండి\s*పని", "Work from home (Telugu)"),
    (r"జాయినింగ్\s*ఫీజు|యాక్టివేషన్\s*ఫీజు", "Joining fee (Telugu)"),
    (r"డిపాజిట్|అడ్వాన్స్", "Deposit/advance (Telugu)"),
    (r"ముందే\s*చెల్లించ|ముందు\s*చెల్లించ", "Pay first (Telugu)"),
    (r"ఇంటర్వ్యూ\s*అక్కరలేదు", "No interview (Telugu)"),
    (r"నెలకు\s*₹\d{4,}|రోజుకు\s*₹\d{3,}", "Unrealistic salary (Telugu)"),
    (r"తక్షణ|అర్జెంట్\s*జాబ్", "Urgent job (Telugu)"),
    (r"WhatsApp\s*చేయండి|టెలిగ్రామ్\s*మాత్రమే", "WhatsApp/Telegram only (Telugu)"),
]


def detect_red_flags(text: str) -> list[str]:
    flags: list[str] = []
    for pattern, label in RED_FLAG_PATTERNS:
        if re.search(pattern, text):
            if label not in flags:
                flags.append(label)
    return flags
