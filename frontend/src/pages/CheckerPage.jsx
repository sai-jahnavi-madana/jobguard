import { useState } from "react";
import { api } from "../api";
import { SAMPLES } from "../constants";
import { shareOnWhatsApp } from "../utils/whatsapp";
import ConnectionError from "../components/ConnectionError";

export const FLAG_EXPLANATIONS = {
  en: {
    "high salary": "The promised salary is unusually high for the described work — a classic bait tactic.",
    "registration fee": "Genuine employers never ask candidates to pay any fee. This is the biggest scam signal.",
    "no experience": "High pay with zero experience required is rarely real — used to attract more applicants.",
    "whatsapp": "Contact is only via WhatsApp with no official email or company domain.",
    "urgent": "Words like 'urgent' or 'limited seats' pressure you into acting without verifying.",
    "guaranteed income": "No legitimate job can guarantee fixed income — pay depends on role and performance.",
    "no website": "No official company website or careers page could be found for this posting.",
    "work from home": "Genuine WFH roles exist, but combined with huge pay and no skills, it's likely fake.",
    "data entry": "Data-entry job ads are commonly used as a front for advance-fee scams.",
    "part time": "Part-time job ads promising large daily income are a frequent scam template.",
    "daily payment": "Daily cash payouts for simple tasks is a common pyramid/scam structure.",
    "security deposit": "Asking for a refundable 'security deposit' before joining is a known scam tactic.",
    "training fee": "Charging a fee for mandatory training before hiring is not standard practice.",
    "courier fee": "Fake job kits sent by courier with a 'shipping fee' demand are a known scam.",
    "interview fee": "Legitimate companies never charge candidates for attending an interview.",
    "processing fee": "Any 'processing fee' tied to hiring or onboarding is a major red flag.",
    "personal bank details": "Sharing bank account details before any formal offer is unsafe.",
    "aadhaar number": "Requesting Aadhaar number early in the process can be used for identity fraud.",
    "otp": "No employer needs your OTP — sharing it can lead to financial fraud.",
    "click this link": "Unverified links can lead to phishing sites that steal your data.",
    "bit.ly": "Shortened links hide the real destination and are often used in phishing.",
    "telegram group": "Job offers routed through anonymous Telegram groups are frequently scams.",
    "instant joining": "Real recruitment involves screening; 'instant joining, no interview' is suspicious.",
    "no interview": "Skipping the interview process entirely is unusual for genuine hiring.",
    "limited seats": "Artificial scarcity ('only 5 seats left') is used to rush your decision.",
    "apply today only": "A strict same-day deadline is designed to prevent you from researching.",
    "earn from home": "Generic 'earn from home' ads with vague job descriptions are common scam bait.",
    "investment required": "Any job requiring you to 'invest' money first is not employment — it's a scam.",
    "mlm": "Multi-level marketing schemes disguised as 'jobs' rely on recruiting others for income.",
    "pyramid scheme": "Income depends on recruiting more people rather than real work — classic pyramid scam.",
    "franchise fee": "Job ads that suddenly ask for a 'franchise' or 'business' fee are misleading.",
    "send resume to gmail": "Genuine companies use official domain emails, not generic Gmail/Yahoo addresses.",
    "personal email": "HR communication from a personal email ID instead of a company domain is suspicious.",
    "no company name": "A job posting that never names the hiring company is a red flag.",
    "vague job description": "Extremely vague duties ('simple online work, easy money') hide the real scam intent.",
    "100% job guarantee": "No agency can guarantee 100% job placement — this is a common false promise.",
    "free laptop": "Offers of a 'free laptop' for remote jobs are often bait for advance-fee fraud.",
    "pay to unlock task": "Tasks that must be 'unlocked' with payment are typical of fake task apps.",
    "crypto payment": "Salary or fee payments demanded in cryptocurrency are hard to trace — high risk.",
    "advance salary": "Offers of 'advance salary' before joining are used to build false trust before a scam.",
    "refundable token money": "'Refundable' token amounts are rarely refunded — a common scam hook.",
    "weekend job huge pay": "Very high pay for minimal weekend work is unrealistic for real employment.",
    "government job guaranteed": "No private agency can 'guarantee' a government job — recruitment is via official exams.",
    "exam not required": "Genuine government jobs require qualifying exams; 'no exam needed' is false.",
    "backdoor entry": "'Backdoor entry' into government/PSU jobs is illegal and almost always a scam.",
    "agent fee": "Paying an 'agent' to secure a job is against official recruitment rules.",
    "lottery winner": "Job offers combined with lottery/prize claims are classic scam bundles.",
    "foreign job visa fee": "Overseas job offers asking upfront visa/processing fees are frequently fraudulent.",
    "passport copy required early": "Sharing passport copies before any verified offer is risky.",
    "personal loan offer": "Job ads bundled with 'personal loan' offers are unrelated and suspicious.",
    "share this message": "Ads urging mass forwarding ('share to 10 people') resemble chain-message scams.",
    "click to verify account": "Account 'verification' links sent via job messages are usually phishing.",
    "apply via sms": "Recruitment entirely through SMS with no formal process is uncommon.",
    "no email provided": "Absence of any contact email makes the posting hard to verify.",
    "unregistered company": "The company name does not match any registered business records.",
    "too good to be true": "If an offer seems too good to be true relative to market standards, be cautious.",
    "salary in advance for training": "Paying you 'in advance' but then asking for training fees is contradictory and suspicious.",
    "ngo donation required": "Job offers tied to mandatory NGO 'donations' are a known fraud variant.",
    "uniform fee": "Charging for uniforms before joining is uncommon for genuine entry-level jobs.",
    "medical test fee": "Paid 'mandatory medical tests' via unknown clinics before joining are suspicious.",
    "joining bonus upfront": "Asking you to pay to 'unlock' a joining bonus is a reversal of normal practice.",
    "spot offer no documents": "Spot offers without any documentation or verification are atypical.",
    "call this number only": "A single personal mobile number as the only contact method is a weak signal.",
    "fixed deposit required": "Requiring an FD or fixed deposit as 'job security' is not standard hiring practice.",
    "sign blank documents": "Never sign blank forms or documents as part of a hiring process.",
    "pay via personal upi": "Payments routed to a personal UPI ID instead of a company account are unsafe.",
    "hr not contactable": "If the 'HR' becomes unreachable after payment, it confirms a scam pattern.",
    "fake offer letter": "Offer letters without official letterhead, seal, or verifiable sender are often fake.",
    "company address mismatch": "If the listed address doesn't match any real business location, be cautious.",
    "salary credited then asked back": "Scams sometimes credit money then ask you to 'refund extra' — never comply.",
    "task-based earning app": "Apps promising earnings for liking/sharing/installing tasks are common scam fronts.",
    "referral bonus only income": "If income relies only on referring others, it's not a real job.",
    "ssc/upsc shortcut": "No 'shortcut' exists for SSC/UPSC selection — such claims are fraudulent.",
    "fee for joining kit": "A mandatory paid 'joining kit' before starting work is a scam indicator.",
    "no fixed work location": "Combined with high pay and vague tasks, no fixed location raises suspicion.",
    "salary in foreign currency small task": "Tiny tasks paying in USD/EUR for unverified apps are common scam setups.",
    "social media job ad only": "Jobs advertised only via random social media posts (no company page) are risky.",
    "instant cash transfer task": "Tasks asking you to receive and forward money are linked to money-mule scams.",
    "personal vehicle required deposit": "Asking for a vehicle 'security deposit' for delivery jobs is a common scam.",
    "online certificate course fee": "Bundling a paid 'certificate course' as a hiring requirement is a red flag.",
    "no terms and conditions": "Absence of any formal terms, contract, or HR policy is unusual for real jobs.",
    "name mismatch with brand": "Using a famous brand name with mismatched official domains/contacts is impersonation.",
    "payment before training video": "Paying to access 'training videos' before any job starts is suspicious.",
    "salary withheld first month": "Claims that the 'first month salary is held as deposit' are non-standard and risky.",
    "recruiter profile incomplete": "Recruiter profiles with no history, photo, or connections are often fake.",
    "too many grammar errors": "Numerous spelling/grammar errors in official-sounding messages suggest a scam.",
    "generic greeting": "Messages starting with 'Dear Candidate' with no personalization are mass-sent scams.",
    "request for selfie with id": "Sending a selfie holding your ID to an unknown recruiter is risky.",
    "job offer without applying": "Receiving an unsolicited job offer for a role you never applied to is suspicious.",
    "salary slip required upfront": "Asking for past salary slips before any interview is unusual and risky to share.",
    "demands immediate decision": "Pressure to 'accept now or lose the offer' bypasses normal decision time.",
    "claims of celebrity endorsement": "Job/earning schemes claiming celebrity backing are almost always fake.",
    "promise of visa on arrival job": "Promises of guaranteed visas for low-skill jobs abroad are frequently fraudulent.",
    "request to download unknown app": "Being asked to install an unverified APK for 'work' can install malware.",
    "payment gateway link for fee": "Sending a payment gateway link to collect a 'fee' confirms scam intent.",
    "claims tie-up with govt scheme": "Falsely claiming a tie-up with a government scheme to appear legitimate.",
    "asks to recruit friends for bonus": "If the main task is recruiting friends/family, it's a pyramid scheme, not a job.",
  },
  te: {
    "high salary": "చేయాల్సిన పని తో పోలిస్తే చెప్పిన జీతం చాలా ఎక్కువ — ఇది common bait trick.",
    "registration fee": "Genuine companies ఎప్పుడూ fee అడగవు. ఇది అతిపెద్ద scam సూచన.",
    "no experience": "ఎక్కువ జీతం + experience అవసరం లేదు అనేది చాలా అరుదు — ఎక్కువ మందిని ఆకర్షించడానికి వాడే trick.",
    "whatsapp": "Contact కేవలం WhatsApp ద్వారా మాత్రమే, official email/website లేదు.",
    "urgent": "'Urgent', 'limited seats' వంటి పదాలు మీని తొందరపెట్టి verify చేసే time లేకుండా చేస్తాయి.",
    "guaranteed income": "ఏ legit job income ని guarantee చేయదు — salary role/performance మీద depend అవుతుంది.",
    "no website": "ఈ posting కి ఏ official company website లేదా careers page కనిపించలేదు.",
    "work from home": "WFH jobs genuine గా ఉండొచ్చు, కానీ చాలా ఎక్కువ జీతం + skills అవసరం లేదు అంటే fake అయి ఉండొచ్చు.",
    "data entry": "Data-entry job ads చాలా సార్లు advance-fee scams కి front గా వాడతారు.",
    "part time": "రోజుకు చాలా ఎక్కువ income promise చేసే part-time ads సాధారణ scam template.",
    "daily payment": "Simple tasks కి daily cash payout ఇస్తామని చెప్పడం పిరమిడ్/scam structure లక్షణం.",
    "security deposit": "Join అయ్యే ముందు 'refundable security deposit' అడగడం known scam tactic.",
    "training fee": "Hire చేయడానికి ముందు mandatory training fee వసూలు చేయడం standard practice కాదు.",
    "courier fee": "Job kit courier ద్వారా పంపి 'shipping fee' అడగడం ఒక known scam.",
    "interview fee": "Genuine companies interview కి candidates నుండి ఎప్పుడూ fee తీసుకోవు.",
    "processing fee": "Hiring/onboarding తో ముడిపడిన ఏ 'processing fee' కూడా major red flag.",
    "personal bank details": "ఏ formal offer రాకముందే bank account details share చేయడం unsafe.",
    "aadhaar number": "Process మొదలులోనే Aadhaar number అడగడం identity fraud కి వాడవచ్చు.",
    "otp": "మీ OTP ఏ employer కి అవసరం లేదు — share చేస్తే financial fraud జరగొచ్చు.",
    "click this link": "Verify చేయని links phishing sites కి తీసుకెళ్లి data steal చేయొచ్చు.",
    "bit.ly": "Shortened links real destination ని hide చేస్తాయి, phishing లో ఎక్కువగా వాడతారు.",
    "telegram group": "Anonymous Telegram groups ద్వారా వచ్చే job offers ఎక్కువగా scams.",
    "instant joining": "Real recruitment లో screening ఉంటుంది; 'instant joining, no interview' అనుమానకరం.",
    "no interview": "ఏ interview process లేకుండా hire చేయడం genuine hiring లో అరుదు.",
    "limited seats": "'Only 5 seats left' వంటి fake scarcity మీని తొందరపెట్టడానికి వాడతారు.",
    "apply today only": "Strict same-day deadline మీరు research చేయకుండా చేయడానికి design చేసింది.",
    "earn from home": "Generic 'earn from home' ads, vague job description తో ఉంటే scam bait అవుతుంది.",
    "investment required": "ఏదైనా job కి ముందు 'invest' చేయమని అడిగితే అది employment కాదు — scam.",
    "mlm": "Job లాగా కనిపించే MLM schemes, ఇతరులను recruit చేయడం మీదే income depend అవుతుంది.",
    "pyramid scheme": "Income real work మీద కాకుండా ఎక్కువ మందిని recruit చేయడం మీద depend అవుతుంది — pyramid scam.",
    "franchise fee": "Job ad సడెన్ గా 'franchise'/'business' fee అడగడం misleading.",
    "send resume to gmail": "Genuine companies official domain email వాడతాయి, generic Gmail/Yahoo కాదు.",
    "personal email": "Company domain కాకుండా personal email నుండి HR communication అనుమానకరం.",
    "no company name": "Hiring company పేరు ఎక్కడా చెప్పని job posting red flag.",
    "vague job description": "'Simple online work, easy money' వంటి vague duties real scam intent ని hide చేస్తాయి.",
    "100% job guarantee": "ఏ agency కూడా 100% job placement guarantee చేయలేదు — ఇది common false promise.",
    "free laptop": "Remote jobs కి 'free laptop' offer చేయడం advance-fee fraud కి bait గా ఉండొచ్చు.",
    "pay to unlock task": "Task 'unlock' చేయడానికి payment అడగడం fake task apps లక్షణం.",
    "crypto payment": "Salary/fee cryptocurrency లో అడగడం trace చేయడం కష్టం — high risk.",
    "advance salary": "Join అయ్యే ముందు 'advance salary' offer చేసి, scam కోసం trust build చేస్తారు.",
    "refundable token money": "'Refundable' token amounts చాలా అరుదుగా refund అవుతాయి — common scam hook.",
    "weekend job huge pay": "Weekend లో తక్కువ పని కి చాలా ఎక్కువ pay genuine employment కి unrealistic.",
    "government job guaranteed": "ఏ private agency కూడా government job ని guarantee చేయలేదు — recruitment official exams ద్వారానే.",
    "exam not required": "Genuine government jobs కి qualifying exams అవసరం; 'no exam needed' false.",
    "backdoor entry": "Government/PSU jobs లో 'backdoor entry' illegal, almost always scam.",
    "agent fee": "Job సాధించడానికి 'agent' కి fee pay చేయడం official recruitment rules కి వ్యతిరేకం.",
    "lottery winner": "Job offer + lottery/prize claims కలిసి వస్తే అది classic scam bundle.",
    "foreign job visa fee": "Overseas job లో upfront visa/processing fee అడగడం చాలా సార్లు fraudulent.",
    "passport copy required early": "Verified offer రాకముందే passport copy share చేయడం risky.",
    "personal loan offer": "Job ad తో పాటు 'personal loan' offer వచ్చడం unrelated మరియు అనుమానకరం.",
    "share this message": "'10 mandiki share చేయండి' అని urge చేసే ads chain-message scams లాగా ఉంటాయి.",
    "click to verify account": "Job message లో account 'verify' link usually phishing.",
    "apply via sms": "SMS ద్వారా మాత్రమే recruitment, formal process లేకుండా ఉండడం uncommon.",
    "no email provided": "ఏ contact email లేకపోతే posting ని verify చేయడం కష్టం.",
    "unregistered company": "Company పేరు ఏ registered business records తో match అవ్వడం లేదు.",
    "too good to be true": "Market standards తో పోలిస్తే offer చాలా బాగుందని అనిపిస్తే జాగ్రత్త.",
    "salary in advance for training": "'Advance' pay చేసి తరువాత training fee అడగడం contradictory మరియు అనుమానకరం.",
    "ngo donation required": "Job offer తో mandatory NGO 'donation' కలిపి ఉండడం known fraud variant.",
    "uniform fee": "Join అయ్యే ముందు uniform కి fee వసూలు చేయడం genuine entry-level jobs లో uncommon.",
    "medical test fee": "Unknown clinics లో paid 'mandatory medical tests' join అయ్యే ముందు అనుమానకరం.",
    "joining bonus upfront": "Joining bonus 'unlock' చేయడానికి మీరు pay చేయమని అడగడం reverse logic.",
    "spot offer no documents": "ఏ documentation/verification లేకుండా spot offer ఇవ్వడం atypical.",
    "call this number only": "Contact కి కేవలం ఒక్క personal mobile number మాత్రమే ఇవ్వడం weak signal.",
    "fixed deposit required": "'Job security' కోసం FD/fixed deposit అడగడం standard hiring practice కాదు.",
    "sign blank documents": "Hiring process లో ఎప్పుడూ blank forms/documents sign చేయకండి.",
    "pay via personal upi": "Company account కాకుండా personal UPI ID కి payment చేయడం unsafe.",
    "hr not contactable": "Payment తర్వాత 'HR' reach అవ్వకపోతే అది scam pattern ని confirm చేస్తుంది.",
    "fake offer letter": "Official letterhead, seal, verifiable sender లేని offer letters చాలా సార్లు fake.",
    "company address mismatch": "Listed address ఏ real business location తో match కాకపోతే జాగ్రత్త.",
    "salary credited then asked back": "కొన్ని scams money credit చేసి తరువాత 'extra refund' అడుగుతాయి — ఎప్పుడూ చేయకండి.",
    "task-based earning app": "Like/share/install tasks కి earning promise చేసే apps common scam fronts.",
    "referral bonus only income": "Income కేవలం referrals మీదే depend అయితే అది real job కాదు.",
    "ssc/upsc shortcut": "SSC/UPSC selection కి ఏ 'shortcut' లేదు — అలాంటి claims fraudulent.",
    "fee for joining kit": "Work మొదలు పెట్టే ముందు mandatory paid 'joining kit' scam indicator.",
    "no fixed work location": "High pay + vague tasks తో పాటు fixed location లేకపోవడం అనుమానకరం.",
    "salary in foreign currency small task": "చిన్న tasks కి USD/EUR లో pay చేస్తామని unverified apps చెప్పడం common scam.",
    "social media job ad only": "Company page లేకుండా కేవలం random social media posts లో job ads risky.",
    "instant cash transfer task": "Money receive చేసి forward చేయమని అడిగే tasks money-mule scams తో linked.",
    "personal vehicle required deposit": "Delivery jobs కి vehicle 'security deposit' అడగడం common scam.",
    "online certificate course fee": "Hiring requirement గా paid 'certificate course' కలపడం red flag.",
    "no terms and conditions": "ఏ formal terms, contract, HR policy లేకపోవడం real jobs లో unusual.",
    "name mismatch with brand": "Famous brand పేరు వాడుతూ official domain/contacts match కాకపోవడం impersonation.",
    "payment before training video": "Job మొదలు పెట్టే ముందు 'training videos' కోసం pay చేయమనడం అనుమానకరం.",
    "salary withheld first month": "'First month salary deposit గా ఉంటుంది' అనే claims non-standard మరియు risky.",
    "recruiter profile incomplete": "History, photo, connections లేని recruiter profiles చాలా సార్లు fake.",
    "too many grammar errors": "Official message లో spelling/grammar errors ఎక్కువగా ఉంటే scam సూచన.",
    "generic greeting": "'Dear Candidate' అని మొదలయ్యే personalization లేని messages mass-sent scams.",
    "request for selfie with id": "ID తో selfie ని unknown recruiter కి పంపడం risky.",
    "job offer without applying": "మీరు apply చేయని role కి unsolicited job offer రావడం అనుమానకరం.",
    "salary slip required upfront": "Interview కి ముందే past salary slips అడగడం unusual మరియు share చేయడం risky.",
    "demands immediate decision": "'Now accept లేదా offer పోతుంది' అనే pressure normal decision time ని bypass చేస్తుంది.",
    "claims of celebrity endorsement": "Celebrity support claim చేసే job/earning schemes almost always fake.",
    "promise of visa on arrival job": "Low-skill jobs abroad కి guaranteed visa promises చాలా సార్లు fraudulent.",
    "request to download unknown app": "Work కోసం unverified APK install చేయమని అడగడం malware install చేయొచ్చు.",
    "payment gateway link for fee": "'Fee' collect చేయడానికి payment gateway link పంపడం scam intent ని confirm చేస్తుంది.",
    "claims tie-up with govt scheme": "Legitimate గా కనిపించడానికి government scheme తో tie-up అని false గా చెప్పడం.",
    "asks to recruit friends for bonus": "Main task friends/family ని recruit చేయడమే అయితే అది job కాదు, pyramid scheme.",
  },
};

export function explainFlag(flag, lang) {
  const dict = FLAG_EXPLANATIONS[lang] || FLAG_EXPLANATIONS.en;
  const f = flag.toLowerCase();
  const key = Object.keys(dict).find((k) => f.includes(k));
  return key ? dict[key] : null;
}

// FIX 1: Removed duplicate SAFETY_STEPS declaration
const SAFETY_STEPS = {
  en: {
    FAKE: [
      "Do not pay any registration, deposit, or joining fee.",
      "Never share Aadhaar, bank details, OTP, or passwords.",
      "Search the company name + 'careers' on Google to verify.",
      "Report this on cybercrime.gov.in or call Helpline 1930.",
      "Block the contact and warn friends/family.",
    ],
    REAL: [
      "Still confirm the offer letter via the company's official HR email.",
      "Verify role, salary, and location in writing.",
      "Call the HR directly if anything feels unclear.",
    ],
  },
  te: {
    FAKE: [
      "ఎటువంటి registration / deposit / joining fee pay చేయకండి.",
      "Aadhaar, bank details, OTP, passwords ఎవరికీ share చేయకండి.",
      "Company name + 'careers' అని Google లో search చేసి verify చేయండి.",
      "cybercrime.gov.in లో report చేయండి లేదా 1930 కి call చేయండి.",
      "ఈ contact ని block చేసి, friends/family కి warn చేయండి.",
    ],
    REAL: [
      "అయినా, offer letter ని company official HR email నుండి confirm చేసుకోండి.",
      "Role, salary, location written గా తీసుకోండి.",
      "ఏదైనా doubt ఉంటే HR కి direct call చేయండి.",
    ],
  },
};

// FIX 2: Renamed TRUSTED_PORTALS → OFFICIAL_PORTALS to match JSX usage
export const OFFICIAL_PORTALS = [
  { name: "National Career Service (NCS)", url: "https://www.ncs.gov.in", category: "Government" },
  { name: "MyGov Jobs", url: "https://www.mygov.in", category: "Government" },
  { name: "SSC (Staff Selection Commission)", url: "https://ssc.nic.in", category: "Government" },
  { name: "UPSC", url: "https://upsc.gov.in", category: "Government" },
  { name: "IBPS", url: "https://www.ibps.in", category: "Government" },
  { name: "Railway Recruitment Board (RRB)", url: "https://indianrailways.gov.in", category: "Government" },
  { name: "AP Government Jobs (APPSC)", url: "https://psc.ap.gov.in", category: "Government" },
  { name: "TS Government Jobs (TSPSC)", url: "https://tspsc.gov.in", category: "Government" },
  { name: "Employment News", url: "https://www.employmentnews.gov.in", category: "Government" },
  { name: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs", category: "Global" },
  { name: "Indeed India", url: "https://in.indeed.com", category: "Global" },
  { name: "Glassdoor", url: "https://www.glassdoor.co.in", category: "Global" },
  { name: "Monster India", url: "https://www.monsterindia.com", category: "Global" },
  { name: "Naukri.com", url: "https://www.naukri.com", category: "India" },
  { name: "Shine.com", url: "https://www.shine.com", category: "India" },
  { name: "TimesJobs", url: "https://www.timesjobs.com", category: "India" },
  { name: "Freshersworld", url: "https://www.freshersworld.com", category: "India" },
  { name: "Apna.co", url: "https://apna.co", category: "India" },
  { name: "Internshala", url: "https://internshala.com", category: "Internships" },
  { name: "AICTE Internship Portal", url: "https://internship.aicte-india.org", category: "Internships" },
  { name: "Infosys Careers", url: "https://www.infosys.com/careers.html", category: "Company" },
  { name: "TCS Careers", url: "https://www.tcs.com/careers", category: "Company" },
  { name: "Wipro Careers", url: "https://careers.wipro.com", category: "Company" },
  { name: "Amazon Jobs", url: "https://www.amazon.jobs", category: "Company" },
  { name: "Google Careers", url: "https://careers.google.com", category: "Company" },
  { name: "Microsoft Careers", url: "https://careers.microsoft.com", category: "Company" },
  { name: "ISRO Careers", url: "https://www.isro.gov.in/Careers.html", category: "Government" },
  { name: "DRDO Careers", url: "https://www.drdo.gov.in", category: "Government" },
  { name: "Upwork", url: "https://www.upwork.com", category: "Remote/Freelance" },
  { name: "Cyber Crime Reporting Portal", url: "https://cybercrime.gov.in", category: "Safety/Reporting" },
  { name: "Telangana State Portal Jobs", url: "https://telangana.gov.in", category: "State Govt" },
  { name: "AP State Portal Jobs", url: "https://ap.gov.in", category: "State Govt" },
];

export const PORTAL_CATEGORIES = [
  "Government",
  "Global",
  "India",
  "Internships",
  "Company",
  "Startup",
  "Professional",
  "Reviews",
  "Remote/Freelance",
  "Blue-collar",
  "Education",
  "Safety/Reporting",
  "State Govt",
  "Skills/Govt",
];

export default function CheckerPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [displayLang, setDisplayLang] = useState("en");

  const check = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.predict(text);
      setResult(data);
    } catch {
      setError("connection");
    }
    setLoading(false);
  };

  const msg = result?.messages?.[displayLang] || result?.messages?.en || {};
  const flags = displayLang === "te"
    ? (result?.red_flags_te || result?.red_flags || [])
    : (result?.red_flags_en || result?.red_flags || []);

  return (
    <div className="page">
      <div className="hero">
        <div className="hero-badge">🛡️ AI-POWERED DETECTION</div>
        <h1>Spot <em>Fake</em> Job Alerts<br />Before They Scam You</h1>
        <p>Paste any job posting — Telugu or English — and get an instant verdict with explanation.</p>
      </div>

      <div className="card">
        <div className="textarea-wrap">
          <textarea
            className="job-textarea"
            placeholder="Paste the job posting here... (Telugu or English supported)"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="char-count">{text.length}</div>
        </div>

        <div className="samples">
          <span style={{ fontSize: 12, color: "var(--muted)", alignSelf: "center" }}>Try:</span>
          {SAMPLES.map((s) => (
            <button key={s.label} type="button" className="sample-btn" onClick={() => setText(s.text)}>
              {s.label}
            </button>
          ))}
        </div>

        <button type="button" className="btn-check" onClick={check} disabled={!text.trim() || loading}>
          {loading ? "Analysing..." : "Check This Job Posting →"}
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner" />
          Analysing job posting...
        </div>
      )}

      {error === "connection" && <ConnectionError onRetry={check} />}

      {result && (
        <div className={`result-card ${result.label.toLowerCase()}`}>
          <div className="result-toolbar">
            <div className="lang-toggle">
              <span className="lang-toggle-label">{msg.language || "Language"}:</span>
              <button
                type="button"
                className={`lang-btn ${displayLang === "en" ? "active" : ""}`}
                onClick={() => setDisplayLang("en")}
              >
                English
              </button>
              <button
                type="button"
                className={`lang-btn ${displayLang === "te" ? "active" : ""}`}
                onClick={() => setDisplayLang("te")}
              >
                తెలుగు
              </button>
            </div>
            <button
              type="button"
              className="btn-whatsapp"
              onClick={() => shareOnWhatsApp(result, displayLang)}
            >
              <span>📲</span> {msg.share_whatsapp || "Share on WhatsApp"}
            </button>
          </div>

          {result.was_translated && (
            <div className="translated-note">
              🌐 {msg.translation_note}
              {result.translated_text && (
                <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
                  {msg.translation_label}: &quot;{result.translated_text.slice(0, 120)}...&quot;
                </div>
              )}
            </div>
          )}

          <div className="result-header">
            <div className="result-icon">{result.label === "FAKE" ? "🚨" : "✅"}</div>
            <div>
              <div className={`result-label ${result.label.toLowerCase()}`}>
                {result.label === "FAKE" ? msg.fake_title : msg.real_title}
              </div>
              <div className="result-conf">
                {result.confidence}% {msg.confidence} ·{" "}
                {result.label === "FAKE" ? msg.fake_advice : msg.real_advice}
              </div>
            </div>
          </div>

          <div className="prob-bars">
            <div className="prob-row">
              <div className="prob-name">{msg.fake_label}</div>
              <div className="prob-track">
                <div className="prob-fill fake" style={{ width: `${result.fake_probability}%` }} />
              </div>
              <div className="prob-pct" style={{ color: "var(--fake)" }}>{result.fake_probability}%</div>
            </div>
            <div className="prob-row">
              <div className="prob-name">{msg.real_label}</div>
              <div className="prob-track">
                <div className="prob-fill real" style={{ width: `${result.real_probability}%` }} />
              </div>
              <div className="prob-pct" style={{ color: "var(--real)" }}>{result.real_probability}%</div>
            </div>
          </div>

          {flags.length > 0 && (
            <div className="red-flags">
              <h4>⚠️ {msg.red_flags_title} ({flags.length})</h4>
              <div className="flags-list">
                {flags.map((f) => (
                  <span key={f} className="flag-chip">{f}</span>
                ))}
              </div>
            </div>
          )}

          {result.label === "REAL" && flags.length === 0 && (
            <div style={{ marginTop: 12, fontSize: 14, color: "var(--muted)" }}>
              ✓ {msg.no_flags}
            </div>
          )}

          {flags.length > 0 && (
            <div className="ai-explain" style={{ marginTop: 14 }}>
              <h4>🤖 {displayLang === "te" ? "ఎందుకు ఇలా చెప్పామో" : "Why we flagged this"}</h4>
              {flags.map((f) => {
                const exp = explainFlag(f, displayLang);
                if (!exp) return null;
                return (
                  <div key={f} style={{ marginTop: 6, fontSize: 13, lineHeight: 1.6 }}>
                    <strong style={{ color: "var(--fake)" }}>• {f}:</strong>{" "}
                    <span style={{ color: "var(--muted)" }}>{exp}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="safety-steps" style={{ marginTop: 14 }}>
            <h4>{displayLang === "te" ? "మీరు తీసుకోవాల్సిన Steps" : "Recommended Next Steps"}</h4>
            <ul style={{ marginTop: 6, paddingLeft: 20, fontSize: 13, color: "var(--muted)", lineHeight: 1.8 }}>
              {(SAFETY_STEPS[displayLang] || SAFETY_STEPS.en)[result.label].map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="official-portals" style={{ marginTop: 12 }}>
            <h4>{displayLang === "te" ? "Trusted Job Portals" : "Trusted Job Portals"}</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
              {OFFICIAL_PORTALS.map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flag-chip"
                  style={{ textDecoration: "none" }}
                >
                  {p.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
