import { useState } from "react";
import { api } from "../api";
import { SCAM_PATTERNS } from "../constants";

export default function ReportPage() {
  const [form, setForm] = useState({ text: "", company: "", city: "" });
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.report(form);
      setSuccess(`Report #${data.id} submitted. Thank you for helping protect others!`);
      setForm({ text: "", company: "", city: "" });
    } catch {
      setError("Could not submit report. Is the backend running?");
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>Report a Scam Job</h1>
        <p style={{ color: "var(--muted)", marginTop: 6, lineHeight: 1.6 }}>
          Found a fake job that wasn&apos;t detected? Submit it here. Your reports improve the model and protect others in your city.
        </p>
      </div>

      {success && <div className="success-banner">✅ {success}</div>}
      {error && <div className="error-banner">⚠️ {error}</div>}

      <div className="card">
        <div className="form-group">
          <label className="form-label" htmlFor="report-text">Job Posting Text *</label>
          <textarea
            id="report-text"
            className="job-textarea form-input"
            placeholder="Paste the full fake job text here..."
            value={form.text}
            onChange={set("text")}
            style={{ minHeight: 140 }}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="report-company">Company Name (if visible)</label>
            <input
              id="report-company"
              className="form-input"
              placeholder="e.g. Fake Amazon India"
              value={form.company}
              onChange={set("company")}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="report-city">Your City</label>
            <input
              id="report-city"
              className="form-input"
              placeholder="e.g. Vijayawada"
              value={form.city}
              onChange={set("city")}
            />
          </div>
        </div>

        <button
          type="button"
          className="btn-check"
          onClick={submit}
          disabled={!form.text.trim() || loading}
          style={{ background: "linear-gradient(135deg, #ff4757, #c0392b)" }}
        >
          {loading ? "Submitting..." : "Submit Report →"}
        </button>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-title" style={{ fontSize: 14, color: "var(--muted)" }}>
          ⚠️ Common scam patterns to watch for
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          {SCAM_PATTERNS.map((p) => (
            <span key={p} className="flag-chip">{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
