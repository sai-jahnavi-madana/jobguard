import { useState } from "react";
import { api } from "../api";
import { SAMPLES } from "../constants";
import { shareOnWhatsApp } from "../utils/whatsapp";
import ConnectionError from "../components/ConnectionError";

// --- AI Explanation: reasons for common red flags (EN + TE) ---
const FLAG_EXPLANATIONS = {
  en: {
    "high salary": "The promised salary is unusually high for the described work — a classic bait tactic.",
    "registration fee": "Genuine employers never ask candidates to pay any fee. This is the biggest scam signal.",
    "no experience": "High pay + zero experience required is rarely real — used to attract more applicants.",
    "whatsapp": "Contact is only via WhatsApp with no official email or company domain.",
    "urgent": "Words like 'urgent' or 'limited seats' pressure you into acting without verifying.",
    "guaranteed income": "No legitimate job can guarantee fixed income — pay depends on role and performance.",
    "no website": "No official company website or careers page could be found for this posting.",
  },
  te: {
    "high salary": "చేయాల్సిన పని తో పోలిస్తే చెప్పిన జీతం చాలా ఎక్కువ — ఇది common bait trick.",
    "registration fee": "Genuine companies ఎప్పుడూ fee అడగవు. ఇది అతిపెద్ద scam సూచన.",
    "no experience": "ఎక్కువ జీతం + experience అవసరం లేదు అనేది చాలా అరుదు — ఎక్కువ మందిని ఆకర్షించడానికి వాడే trick.",
    "whatsapp": "Contact కేవలం WhatsApp ద్వారా మాత్రమే, official email/website లేదు.",
    "urgent": "'Urgent', 'limited seats' వంటి పదాలు మీని తొందరపెట్టి verify చేసే time లేకుండా చేస్తాయి.",
    "guaranteed income": "ఏ legit job income ని guarantee చేయదు — salary role/performance మీద depend అవుతుంది.",
    "no website": "ఈ posting కి ఏ official company website లేదా careers page కనిపించలేదు.",
  },
};

function explainFlag(flag, lang) {
  const dict = FLAG_EXPLANATIONS[lang] || FLAG_EXPLANATIONS.en;
  const key = Object.keys(dict).find((k) => flag.toLowerCase().includes(k));
  return key ? dict[key] : null;
}

// --- Safety Recommendations based on verdict ---
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

// --- Trusted job portals ---
const OFFICIAL_PORTALS = [
  { name: "National Career Service", url: "https://www.ncs.gov.in" },
  { name: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs" },
  { name: "Naukri.com", url: "https://www.naukri.com" },
  { name: "Indeed India", url: "https://in.indeed.com" },
  { name: "Cyber Crime Report", url: "https://cybercrime.gov.in" },
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

          {/* AI Explanation */}
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

          {/* Safety Recommendations */}
          <div className="safety-steps" style={{ marginTop: 14 }}>
            <h4>{displayLang === "te" ? "మీరు తీసుకోవాల్సిన Steps" : "Recommended Next Steps"}</h4>
            <ul style={{ marginTop: 6, paddingLeft: 20, fontSize: 13, color: "var(--muted)", lineHeight: 1.8 }}>
              {(SAFETY_STEPS[displayLang] || SAFETY_STEPS.en)[result.label].map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Official Portals */}
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
