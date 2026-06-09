import { Link } from "react-router-dom";
import HelplineBanner from "../components/HelplineBanner";
import { SAFETY_TIPS } from "../constants";

const STEPS = [
  { num: "01", title: "Paste the job posting", desc: "Copy any job alert from WhatsApp, Telegram, or email — Telugu or English." },
  { num: "02", title: "AI analyses red flags", desc: "Our model checks for scam patterns like registration fees, guaranteed income, and more." },
  { num: "03", title: "Get a clear verdict", desc: "See FAKE or REAL with confidence score, explanation, and shareable results." },
];

export default function AboutPage() {
  return (
    <div className="page-wide">
      <div className="hero" style={{ marginBottom: 40 }}>
        <div className="hero-badge">🤝 COMMUNITY SERVICE PROJECT</div>
        <h1>About <em>JobGuard</em></h1>
        <p>
          A free tool to help job seekers spot fake job scams before they lose money or share personal details.
        </p>
      </div>

      <div className="card about-mission">
        <div className="section-title">Our Mission</div>
        <p className="about-text">
          Every day, thousands of people in India receive fake job offers on WhatsApp and social media —
          promising easy money, no experience, and work from home. Many lose their savings to registration
          fees and advance payments. JobGuard was built as a community service project to give everyone
          a free, instant way to check whether a job posting looks genuine or suspicious.
        </p>
        <p className="about-text" style={{ marginTop: 12 }}>
          Built with AI + red flag detection, supporting both <strong>English</strong> and <strong>తెలుగు</strong>.
        </p>
        <Link to="/" className="about-cta">Try the Job Checker →</Link>
      </div>

      <div className="card">
        <div className="section-title">How It Works</div>
        <div className="steps-grid">
          {STEPS.map((s) => (
            <div key={s.num} className="step-card">
              <div className="step-num">{s.num}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-title">Safety Tips — Stay Safe from Job Scams</div>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
          Follow these rules before applying to any job posting you receive online.
        </p>
        <div className="tips-grid">
          {SAFETY_TIPS.map((tip) => (
            <div key={tip.title} className="tip-card">
              <div className="tip-icon">{tip.icon}</div>
              <div className="tip-title">{tip.title}</div>
              <div className="tip-title-te">{tip.titleTe}</div>
              <div className="tip-desc">{tip.desc}</div>
              <div className="tip-desc-te">{tip.descTe}</div>
            </div>
          ))}
        </div>
      </div>

      <HelplineBanner />

      <div className="card about-footer-note">
        <p>
          JobGuard is a community service project by <span className="footer-name-inline">Sai Jahnavi Madana</span>.
          If you spot a scam we missed, please <Link to="/report" className="inline-link">report it here</Link> so we can protect more people.
        </p>
      </div>
    </div>
  );
}
