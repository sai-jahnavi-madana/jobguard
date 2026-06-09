import { HELPLINES } from "../constants";

export default function HelplineBanner({ compact = false }) {
  return (
    <div className={`helpline-banner ${compact ? "compact" : ""}`}>
      <div className="helpline-banner-title">
        {compact ? "🆘 Scammed? Get help now" : "🆘 Report Cyber Fraud — Official Helplines"}
      </div>
      <div className="helpline-grid">
        {HELPLINES.map((h) => (
          <a
            key={h.label}
            href={h.href}
            target="_blank"
            rel="noopener noreferrer"
            className="helpline-card"
          >
            <div className="helpline-label">{h.label}</div>
            <div className="helpline-value">{h.value}</div>
            {!compact && <div className="helpline-desc">{h.desc}</div>}
          </a>
        ))}
      </div>
    </div>
  );
}
