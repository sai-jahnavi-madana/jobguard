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
     # More FAKE
    ("Earn money online without investment. Daily payment guaranteed. No experience needed. WhatsApp immediately urgent job.", 1),
    ("Free lancing job at home. ₹800 per hour guaranteed. No qualification needed. Pay kit fee ₹200 first.", 1),
    ("Packing work from home. ₹15000 guaranteed monthly. No experience. Send ₹500 deposit to start.", 1),
    ("Online survey job. Earn ₹2000 daily guaranteed. No interview. Pay activation fee ₹150 now.", 1),
    ("Urgent vacancy! 500 seats only. No experience ₹45000 salary. WhatsApp for instant joining fee.", 1),
    ("Work from home data entry. Earn ₹1000 per hour. No qualification required. Registration fee ₹399.", 1),
    ("రోజుకు ₹3000 సంపాదించండి. ఇంట్లో నుండి పని. అనుభవం అక్కరలేదు. ₹500 ఫీజు చెల్లించండి.", 1),
    ("Guaranteed job abroad. Pay visa processing fee ₹5000. No interview. Immediate joining.", 1),
    ("Copy paste job from home. ₹500 per hour. No experience. Pay training fee first via UPI.", 1),
    ("100% genuine online job. Earn lakhs monthly. No target no pressure. Just pay joining fee.", 1),
    ("Reselling job from home. Earn ₹2000 daily. No investment but pay ₹300 registration.", 1),
    ("YouTube job work from home. Like and subscribe task. Earn ₹1500 daily. Pay deposit ₹200.", 1),
    ("Urgent hiring! Earn ₹5000 daily from mobile. No experience. Pay ₹199 to activate account.", 1),
    ("Online captcha typing job. Earn ₹800 per hour. No experience needed. Pay ₹100 registration.", 1),
    ("WhatsApp forwarding job. Earn ₹2000 per day. No experience. Pay ₹250 joining fee immediately.", 1),
    ("Part time job for housewives. Earn ₹25000 monthly guaranteed. No interview. Pay ₹500 deposit.", 1),
    ("Ad posting job from home. Earn ₹1000 per hour guaranteed. Pay ₹299 to get started now.", 1),
    ("Mobile recharge job. Earn ₹50000 monthly. No experience needed. Pay ₹999 registration fee.", 1),
    ("Form filling job from home. ₹500 per form guaranteed. No qualification. Pay ₹150 first.", 1),
    ("100% work from home. No boss no target. Earn ₹80000 monthly. Pay ₹2000 training fee.", 1),
    ("Amazon Flipkart work from home reselling. Earn ₹3000 daily. No experience. Registration ₹499.", 1),
    ("Urgent! 1000 vacancies. No interview no experience. Direct joining pay ₹300 fee now.", 1),
    ("Online teaching job. Earn ₹2000 per hour. No degree needed. Pay ₹500 registration fee.", 1),
    ("Stock market job from home. Earn daily guaranteed. No experience. Pay ₹1000 training fee.", 1),
    ("Crypto job from home. Earn ₹5000 daily guaranteed. No experience. Pay ₹999 to join now.", 1),
    ("తక్షణ జాబ్! రోజుకు ₹2000 గ్యారంటీ. అనుభవం అక్కరలేదు. ₹300 చెల్లించి వెంటనే జాయిన్ అవ్వండి.", 1),
    ("నెలకు ₹50000 సంపాదించండి. ఇంట్లో నుండి పని. ఇంటర్వ్యూ అక్కరలేదు. ₹500 రిజిస్ట్రేషన్ ఫీజు చెల్లించండి.", 1),
    ("ఆన్‌లైన్ డేటా ఎంట్రీ జాబ్. రోజుకు ₹1500 గ్యారంటీ. అర్హత అక్కరలేదు. ముందు ₹200 చెల్లించండి.", 1),
    ("అర్జెంట్! 500 పోస్టులు. అనుభవం అక్కరలేదు. నెలకు ₹40000. వెంటనే WhatsApp చేయండి ఫీజు చెల్లించండి.", 1),
    ("ఫ్రీలాన్సింగ్ జాబ్. గంటకు ₹800 గ్యారంటీ. అర్హత అక్కరలేదు. ₹300 కిట్ ఫీజు పంపండి.", 1),
    ("Earn from home typing job. ₹700 per hour. No experience required. Send ₹200 via GPay first.", 1),
    ("Daily income guaranteed ₹3000. Work from home. No interview. Pay ₹399 joining fee WhatsApp.", 1),
    ("Immediate job! No experience ₹45000 salary. Work from home. Pay ₹1000 processing fee today.", 1),
    ("Online job for students. Earn ₹2000 daily. No experience needed. Pay ₹100 registration now.", 1),
    ("Genuine home based job. Earn ₹1200 hourly. No qualification. Pay advance ₹500 to start.", 1),
    ("MLM downline job. Earn unlimited. Pay ₹2000 to join. No experience. 100% income guaranteed.", 1),
    ("Packaging job from home. Earn ₹800 daily. No experience. Deposit ₹300 get materials.", 1),
    ("International call center fake. Work from home. ₹50000 salary. Pay ₹5000 training fee now.", 1),
    ("Earn ₹1000 per hour at home. No experience no interview. Pay ₹250 activation fee immediately.", 1),
    ("Photo editing job from home. Earn ₹2000 daily guaranteed. No experience. Fee ₹199 registration.", 1),
    ("Online tutor job no experience. Earn ₹3000 per hour. Pay ₹500 joining fee to start teaching.", 1),
    ("Translation job from home. Earn ₹5000 daily. No experience needed. Pay ₹300 first via UPI.", 1),
    ("Content writing job. Earn ₹2000 per article guaranteed. No experience. Pay ₹400 registration.", 1),
    ("Graphic design job from home. ₹3000 daily no experience. Pay ₹299 to get software kit.", 1),
    ("Video editing job. Earn ₹4000 daily guaranteed. No qualification. Pay ₹500 joining fee.", 1),
    ("Social media job. Like share earn ₹2000 daily. No experience. Pay ₹150 activation fee now.", 1),
    ("Lottery winner job! You won ₹10 lakh. Pay ₹500 processing fee to claim your prize now.", 1),
    ("Foreign company hiring Indians. No experience ₹1 lakh salary. Pay ₹10000 visa fee first.", 1),
    ("Night shift home job. Earn ₹3000 nightly guaranteed. No experience. Pay ₹199 to join now.", 1),
    ("Tele calling job fake. Work from home ₹50000. No experience. Pay ₹1000 training fee first.", 1),
    ("రాత్రి పని ఇంట్లో నుండి. రోజుకు ₹2500 గ్యారంటీ. అనుభవం అక్కరలేదు. ₹200 ముందే చెల్లించండి.", 1),
    ("అమెజాన్ రిసెల్లింగ్ జాబ్. రోజుకు ₹3000 సంపాదించండి. అనుభవం అక్కరలేదు. ₹499 రిజిస్ట్రేషన్.", 1),
    ("ఆన్‌లైన్ సర్వే జాబ్. రోజుకు ₹2000 గ్యారంటీ. ఇంటర్వ్యూ అక్కరలేదు. ₹150 యాక్టివేషన్ ఫీజు.", 1),
    ("విద్యార్థులకు జాబ్. రోజుకు ₹1500 సంపాదించండి. అర్హత అక్కరలేదు. ₹100 రిజిస్ట్రేషన్ చెల్లించండి.", 1),
    ("ఫోటో ఎడిటింగ్ జాబ్. రోజుకు ₹2000 గ్యారంటీ. అనుభవం అక్కరలేదు. ₹199 ఫీజు పంపండి.", 1),
    ("గృహిణులకు జాబ్. నెలకు ₹25000 గ్యారంటీ. ఇంటర్వ్యూ అక్కరలేదు. ₹500 డిపాజిట్ చెల్లించండి.", 1),
    ("డేటా ఎంట్రీ జాబ్. గంటకు ₹1000 గ్యారంటీ. అర్హత అక్కరలేదు. ₹399 రిజిస్ట్రేషన్ ఫీజు.", 1),
    ("WhatsApp ఫార్వర్డింగ్ జాబ్. రోజుకు ₹2000. అనుభవం అక్కరలేదు. ₹250 జాయినింగ్ ఫీజు.", 1),
    ("క్రిప్టో జాబ్ ఇంట్లో నుండి. రోజుకు ₹5000 గ్యారంటీ. ₹999 చెల్లించి జాయిన్ అవ్వండి.", 1),
    ("స్టాక్ మార్కెట్ జాబ్. రోజు ₹4000 సంపాదించండి. అనుభవం అక్కరలేదు. ₹1000 ట్రైనింగ్ ఫీజు.", 1),
    ("Beware! Earn ₹10000 daily doing nothing. No skills no experience. Pay ₹1000 deposit first.", 1),
    ("Housewife job offer. Pack items at home. Earn ₹20000. Pay ₹400 material deposit now.", 1),
    ("Work from home assembling job. Earn ₹1500 daily. No experience. Pay ₹250 kit fee first.", 1),
    ("Fake government job offer. Central govt vacancy. No exam pay ₹2000 fee for appointment.", 1),
    ("Railway job without exam. Pay ₹3000 fee get job guaranteed. No experience needed apply now.", 1),
    ("Bank job without exam. Pay ₹5000 processing fee. Guaranteed selection. No experience required.", 1),
    ("Police job without exam. Pay ₹10000 bribe fee. Direct appointment guaranteed. WhatsApp now.", 1),
    ("Teacher job without B.Ed. Pay ₹3000 fee. Guaranteed government school appointment. No exam.", 1),
    ("Nurse job without experience. Pay ₹2000 registration. Immediate joining hospital guaranteed.", 1),
    ("Doctor job fake. MBBS not required. Pay ₹50000 fee get medical officer post guaranteed.", 1),
    ("IAS officer job without UPSC. Pay ₹1 lakh fee. Direct appointment guaranteed. WhatsApp.", 1),

    # More REAL
    ("Cognizant is hiring Python Developer in Chennai. 3+ years Django experience required. Formal interview process. Apply on Cognizant careers.", 0),
    ("Hyderabad based startup hiring React Developer. 1-2 years experience. Competitive salary. Technical interview via Zoom. Email resume to hr@company.com.", 0),
    ("Bank of India PO recruitment 2024. Graduation required. Written exam and interview. Apply on bankofIndia.co.in official site.", 0),
    ("Google India hiring Site Reliability Engineer. Bangalore. Strong systems background required. Multiple technical rounds.", 0),
    ("Wipro BPS walk-in for graduates. Communication skills required. PF and ESI benefits. Bring original documents.", 0),
    ("HDFC Bank relationship manager vacancy. Graduate with 1 year banking experience. Fixed salary plus incentives. Apply on HDFC careers.", 0),
    ("Amazon India hiring Operations Manager. MBA preferred. 5+ years supply chain experience. Structured interview process.", 0),
    ("విప్రో హైదరాబాద్‌లో జావా డెవలపర్ నియామకం. 3 సంవత్సరాల అనుభవం అవసరం. టెక్నికల్ ఇంటర్వ్యూ ఉంటుంది. అఫీషియల్ వెబ్‌సైట్‌లో దరఖాస్తు చేయండి.", 0),
    ("Zomato hiring delivery executives. Two wheeler required. Weekly payment. No registration fee. Walk-in interview.", 0),
    ("Teaching job at Delhi Public School Hyderabad. B.Ed required. Subject matter expertise. Demo class required.", 0),
    ("Infosys BPO hiring voice process executives. Graduation required. Night shift allowance. PF benefits. Apply online.", 0),
    ("UPSC Civil Services 2024 notification. Graduate required. Prelims mains and interview stages. Apply on upsc.gov.in.", 0),
    ("Swiggy hiring delivery partners. Valid driving license required. Weekly earnings. No joining fee. Walk-in anytime.", 0),
    ("Tata Consultancy Services hiring Business Analyst. 3+ years experience. MBA preferred. Apply through TCS portal.", 0),
    ("ICICI Bank hiring relationship executives. Graduation required. Sales experience preferred. Apply on ICICI careers site.", 0),
    ("Hyderabad IT company hiring Android Developer. 2+ years Kotlin experience. Competitive CTC. LinkedIn apply.", 0),
    ("IBM India hiring Cloud Engineer. AWS certification preferred. 3+ years experience. Formal technical interviews.", 0),
    ("Mahindra hiring Mechanical Engineer. B.E Mechanical required. 2+ years automobile experience. Apply on Mahindra careers.", 0),
    ("NTPC recruitment for Graduate Apprentice. Engineering degree required. Stipend provided. Apply on ntpc.co.in.", 0),
    ("ISRO scientist recruitment. M.Tech or PhD required. Written test and interview. Apply on isro.gov.in.", 0),
    ("టాటా కన్సల్టెన్సీ హైదరాబాద్‌లో డేటా అనలిస్ట్ నియామకం. SQL మరియు Python అవసరం. 2+ సంవత్సరాల అనుభవం. TCS కెరీర్స్‌లో దరఖాస్తు చేయండి.", 0),
    ("ఇన్ఫోసిస్ బెంగళూరులో ఫ్రెషర్స్ కోసం నియామకం. B.Tech 2024 బ్యాచ్. ఆప్టిట్యూడ్ మరియు టెక్నికల్ ఇంటర్వ్యూ. ఆఫీషియల్ వెబ్‌సైట్‌లో రిజిస్టర్ చేయండి.", 0),
    ("హైదరాబాద్ స్టార్టప్ రియాక్ట్ డెవలపర్‌ని నియమిస్తోంది. 1-2 సంవత్సరాల అనుభవం. కాంపిటీటివ్ జీతం. Zoom ద్వారా ఇంటర్వ్యూ.", 0),
    ("HDFC బ్యాంక్ రిలేషన్‌షిప్ మేనేజర్ పోస్ట్. గ్రాడ్యుయేషన్ అవసరం. బ్యాంకింగ్ అనుభవం ప్రాధాన్యత. HDFC కెరీర్స్‌లో దరఖాస్తు చేయండి.", 0),
    ("Accenture hiring Full Stack Developer. React and Node.js. 2-5 years experience. Interview process includes technical and HR rounds.", 0),
    ("Deloitte hiring Data Scientist. Python R and ML experience required. 3+ years. Apply through Deloitte careers portal.", 0),
    ("Oracle India hiring Database Administrator. 4+ years Oracle DB experience. Hyderabad office. Formal interview process.", 0),
    ("Byju's hiring Academic Counselor. Graduate required. Good communication skills. Salary plus incentives. Apply on Byju's careers.", 0),
    ("PhonePe hiring Product Manager. 3+ years PM experience. Engineering background preferred. Bangalore office.", 0),
    ("Ola hiring Software Engineer. 2+ years experience. Bangalore. Technical rounds required. Apply on Ola careers.", 0),
    ("Paytm hiring Backend Engineer. Java or Go experience. 2+ years. Noida office. Apply through Paytm careers.", 0),
    ("BSNL recruitment for Junior Telecom Officers. B.Tech required. Written exam. Apply on bsnl.co.in official portal.", 0),
    ("SBI clerk recruitment 2024. Graduation required. Written exam and interview. Apply on sbi.co.in official website.", 0),
    ("RBI Grade B officer recruitment. Graduation required. Phase 1 and 2 exams plus interview. Apply on rbi.org.in.", 0),
    ("HAL recruitment for Design Engineer. Aeronautical engineering required. Written test. Apply on hal-india.co.in.", 0),
    ("DRDO recruitment for scientist. M.Tech required. Written exam and interview. Apply on drdo.gov.in official site.", 0),
    ("Reliance Jio hiring Network Engineer. B.Tech telecom required. 1-2 years experience. Apply on Jio careers portal.", 0),
    ("Airtel hiring Sales Executive. Graduate required. Field sales experience preferred. Fixed salary plus incentives.", 0),
    ("స్విగ్గీ డెలివరీ పార్ట్‌నర్లను నియమిస్తోంది. వాహనం అవసరం. వారంవారీ చెల్లింపు. జాయినింగ్ ఫీజు లేదు. వాక్-ఇన్ ఇంటర్వ్యూ.", 0),
    ("SBI క్లర్క్ నియామకం 2024. గ్రాడ్యుయేషన్ అవసరం. రాత పరీక్ష మరియు ఇంటర్వ్యూ. sbi.co.in లో దరఖాస్తు చేయండి.", 0),
    ("జొమాటో డెలివరీ ఎగ్జిక్యూటివ్స్ నియామకం. లైసెన్స్ అవసరం. వారంవారీ చెల్లింపు. రిజిస్ట్రేషన్ ఫీజు లేదు.", 0),
    ("రిలయన్స్ జియో నెట్‌వర్క్ ఇంజనీర్ నియామకం. B.Tech అవసరం. 1-2 సంవత్సరాల అనుభవం. జియో కెరీర్స్‌లో దరఖాస్తు.", 0),
    ("Myntra hiring Fashion Consultant. Graduate required. Retail experience preferred. Mumbai office. Apply on Myntra careers.", 0),
    ("Naukri.com hiring Software Developer. 2+ years experience. Delhi NCR. Technical interview rounds. Apply on company site.", 0),
    ("KPMG India hiring Tax Consultant. CA required. 2+ years experience. Mumbai or Bangalore. Apply on KPMG careers.", 0),
    ("PwC India hiring Audit Associate. CA or MBA Finance. 1-2 years experience. Multiple city openings. Apply on PwC careers.", 0),
    ("EY hiring Risk Analyst. Graduate with finance background. 1+ year experience. Hyderabad office. Formal interview.", 0),
    ("Hindustan Unilever hiring Sales Officer. Graduate required. FMCG experience preferred. Salary plus travel allowance.", 0),
    ("ITC hiring Management Trainee. MBA from premier institute. Campus placement process. Apply before deadline.", 0),
    ("Nestle India hiring Brand Manager. MBA Marketing required. 3+ years FMCG experience. Gurgaon office.", 0),
    ("Asian Paints hiring Territory Sales Manager. Graduate required. 2+ years sales experience. Apply on Asian Paints careers.", 0),
    ("Dr. Reddy's hiring Quality Analyst. B.Pharm required. 2+ years pharma experience. Hyderabad. Apply on company portal.", 0),
    ("Sun Pharma hiring Medical Representative. Graduate required. Good communication. Field work. Company vehicle provided.", 0),
    ("Cipla hiring Regulatory Affairs Executive. M.Pharm preferred. 2+ years experience. Mumbai. Apply on Cipla careers.", 0),
    ("Biocon hiring Research Associate. M.Sc Biotechnology required. Lab experience needed. Bangalore. Formal interview.", 0),
    ("డాక్టర్ రెడ్డీస్ క్వాలిటీ అనలిస్ట్ నియామకం. B.Pharm అవసరం. 2+ సంవత్సరాల అనుభవం. హైదరాబాద్. కంపెనీ పోర్టల్‌లో దరఖాస్తు.", 0),
    ("సన్ ఫార్మా మెడికల్ రిప్రజెంటేటివ్ నియామకం. గ్రాడ్యుయేషన్ అవసరం. కమ్యూనికేషన్ స్కిల్స్. కంపెనీ వాహనం అందించబడుతుంది.", 0),
    # Extra FAKE
    ("Earn ₹500 per hour doing simple mobile tasks. No experience. Pay ₹99 to unlock tasks now.", 1),
    ("Urgent! 2000 vacancies. Work from home. No interview no experience. Pay ₹200 joining fee.", 1),
    ("Online business opportunity. Earn ₹1 lakh monthly. No investment they say but pay ₹5000 first.", 1),
    ("Meesho reselling job. Earn ₹3000 daily. No experience. Registration fee ₹299 pay now.", 1),
    ("Insurance agent job fake. Earn ₹80000 monthly. No experience. Pay ₹2000 training fee.", 1),
    ("Delivery job from home. Earn ₹2000 daily guaranteed. Pay ₹150 kit fee first via PhonePe.", 1),
    ("Simple computer job from home. Earn ₹1500 hourly. No experience. Pay ₹399 registration.", 1),
    ("తక్షణ ఆన్‌లైన్ జాబ్. నెలకు ₹60000 గ్యారంటీ. అనుభవం అక్కరలేదు. ₹500 ముందే చెల్లించండి.", 1),
    ("మొబైల్ నుండి పని. రోజుకు ₹1000 గ్యారంటీ. ఇంటర్వ్యూ అక్కరలేదు. ₹99 యాక్టివేషన్ ఫీజు.", 1),
    ("Earn daily from Instagram job. Like follow earn ₹2000. No experience. Pay ₹200 deposit.", 1),
    ("Amazon delivery partner fake job. Earn ₹4000 daily. Pay ₹500 ID verification fee first.", 1),
    ("Make money from home without any work. Guaranteed ₹5000 daily. Just pay ₹1000 fee.", 1),
    ("Urgent government job offer. Pay ₹3000 fee get peon post. No exam guaranteed selection.", 1),
    ("Online gaming job. Play games earn ₹2000 hourly. No experience. Pay ₹299 to start.", 1),
    ("Housekeeping job abroad. No experience. ₹1 lakh salary. Pay ₹15000 visa processing fee.", 1),
    ("ఆన్‌లైన్ గేమింగ్ జాబ్. గంటకు ₹2000 సంపాదించండి. అనుభవం అక్కరలేదు. ₹299 ఫీజు చెల్లించండి.", 1),
    ("రోజుకు ₹5000 సంపాదించండి. ఇంట్లో నుండి పని. ఇంటర్వ్యూ లేదు. ₹999 జాయినింగ్ ఫీజు.", 1),
    ("Immediate vacancy! 100 seats. No experience ₹35000 salary. Pay ₹500 fee WhatsApp now.", 1),
    ("Earn from Telegram group job. Forward messages earn ₹1000 daily. Pay ₹100 joining fee.", 1),
    ("Simple clicking job from home. Earn ₹800 per hour. No experience. Pay ₹50 to activate.", 1),
    ("Work from home call center fake. ₹40000 salary. No experience. Pay ₹2000 training now.", 1),
    ("అర్జెంట్ వేకెన్సీ! 200 పోస్టులు. అనుభవం అక్కరలేదు. నెలకు ₹35000. ₹300 ఫీజు చెల్లించండి.", 1),
    ("ఆన్‌లైన్ బిజినెస్ అవకాశం. నెలకు ₹1 లక్ష సంపాదించండి. ₹5000 ముందే చెల్లించాలి.", 1),
    ("Earn ₹2000 daily watching videos online. No experience needed. Pay ₹199 activation fee.", 1),
    ("Fake HR job offer. Work from home HR executive. ₹45000. No experience. Pay ₹1500 fee.", 1),

    # Extra REAL
    ("Wipro hiring Project Manager. PMP certification preferred. 8+ years IT experience. Apply on Wipro careers portal.", 0),
    ("Larsen and Toubro hiring Civil Engineer. B.E Civil required. 3+ years construction experience. Mumbai office.", 0),
    ("Bajaj Finance hiring Sales Manager. Graduate required. 2+ years NBFC experience. Apply on Bajaj careers.", 0),
    ("Tech Mahindra hiring SAP Consultant. 4+ years SAP FICO experience. Pune office. Apply on Tech Mahindra careers.", 0),
    ("Mphasis hiring Software Engineer. Java or Python. 1-3 years experience. Bangalore. Apply through Mphasis careers.", 0),
    ("హెచ్‌సీఎల్ టెక్నాలజీస్ హైదరాబాద్‌లో జావా డెవలపర్ నియామకం. B.Tech అవసరం. 2+ సంవత్సరాల అనుభవం.", 0),
    ("మైక్రోసాఫ్ట్ ఇండియా సాఫ్ట్‌వేర్ ఇంజనీర్ నియామకం. CS డిగ్రీ అవసరం. బెంగళూరు. మల్టిపుల్ ఇంటర్వ్యూ రౌండ్స్.", 0),
    ("Axis Bank hiring Credit Analyst. MBA Finance required. 2+ years banking experience. Mumbai. Apply on Axis careers.", 0),
    ("Kotak Mahindra hiring Relationship Manager. Graduate required. Banking experience preferred. Apply on Kotak careers.", 0),
    ("Tata Motors hiring Production Engineer. B.E Mechanical required. 2+ years auto experience. Pune plant.", 0),
    ("Hero MotoCorp hiring Quality Engineer. B.Tech required. 1-2 years experience. Gurugram plant. Apply on Hero careers.", 0),
    ("TVS Motors hiring Design Engineer. B.E Mechanical required. Hosur plant. Apply on TVS careers portal.", 0),
    ("బజాజ్ ఫైనాన్స్ సేల్స్ మేనేజర్ నియామకం. గ్రాడ్యుయేషన్ అవసరం. 2+ సంవత్సరాల అనుభవం. బజాజ్ కెరీర్స్‌లో దరఖాస్తు.", 0),
    ("యాక్సిస్ బ్యాంక్ క్రెడిట్ అనలిస్ట్ నియామకం. MBA ఫైనాన్స్ అవసరం. 2+ సంవత్సరాల అనుభవం. ముంబై.", 0),
    ("Zepto hiring Operations Executive. Graduate required. Logistics experience preferred. Hyderabad. No registration fee.", 0),
    ("Dunzo hiring Delivery Manager. Graduate required. Operations experience. Bangalore. Apply on Dunzo careers.", 0),
    ("Razorpay hiring Backend Engineer. Node.js or Go. 2+ years experience. Bangalore. Technical interviews required.", 0),
    ("Freshworks hiring Customer Success Manager. Graduate required. SaaS experience preferred. Chennai office.", 0),
    ("Zoho hiring Software Developer. B.Tech required. Coding test and interview rounds. Chennai. Apply on Zoho careers.", 0),
    ("జోహో సాఫ్ట్‌వేర్ డెవలపర్ నియామకం. B.Tech అవసరం. కోడింగ్ టెస్ట్ మరియు ఇంటర్వ్యూ. చెన్నై. జోహో కెరీర్స్‌లో దరఖాస్తు.", 0),
    ("ఫ్రెష్‌వర్క్స్ కస్టమర్ సక్సెస్ మేనేజర్ నియామకం. గ్రాడ్యుయేషన్ అవసరం. SaaS అనుభవం. చెన్నై.", 0),
    ("HDFC Life Insurance hiring Sales Executive. Graduate required. Insurance experience preferred. Commission based.", 0),
    ("LIC agent recruitment. Graduate required. IRDA exam required. Training provided. Commission based income.", 0),
    ("ఎల్‌ఐసి ఏజెంట్ నియామకం. గ్రాడ్యుయేషన్ అవసరం. IRDA పరీక్ష అవసరం. శిక్షణ అందించబడుతుంది.", 0),
    ("Byju's hiring Math Teacher. B.Sc or B.Tech required. Good communication skills. Online teaching. Apply on Byju's.", 0),
    ("Unacademy hiring Educator. Subject expertise required. Online teaching platform. Apply on Unacademy careers.", 0),
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
