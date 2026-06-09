import { useState } from "react";
import { api } from "../api";
import { SAMPLES } from "../constants";
import { shareOnWhatsApp } from "../utils/whatsapp";

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
      setError("Could not connect to backend. Make sure FastAPI is running on port 8000.");
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

      {error && <div className="error-banner">⚠️ {error}</div>}

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
        </div>
      )}
    </div>
  );
}
