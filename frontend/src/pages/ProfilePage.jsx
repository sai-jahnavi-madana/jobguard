import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { api } from "../api";
import ConnectionError from "../components/ConnectionError";
import { useAuth } from "../context/AuthContext";

function formatDate(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([api.myStats(), api.myHistory()])
      .then(([s, h]) => {
        setStats(s);
        setHistory(h);
      })
      .catch(() => setError("connection"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) loadProfile();
  }, [user, loadProfile]);

  if (authLoading) {
    return (
      <div className="page">
        <div className="loading"><div className="spinner" /> Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: { pathname: "/profile" } }} />;
  }

  const memberSince = new Date(user.created_at).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="page-wide">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>My Profile</h1>
        <p style={{ color: "var(--muted)", marginTop: 6 }}>
          Your account details and job check history.
        </p>
      </div>

      <div className="profile-header card">
        <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div className="profile-info">
          <div className="profile-name">{user.name}</div>
          <div className="profile-email">{user.email}</div>
          <div className="profile-meta">
            Member since {memberSince}
            {user.is_admin && <span className="profile-badge">Admin</span>}
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading"><div className="spinner" /> Loading your activity...</div>
      )}

      {error && <ConnectionError message="Cannot load profile" onRetry={loadProfile} />}

      {!loading && !error && stats && (
        <>
          <div className="stats-grid" style={{ marginTop: 20 }}>
            <div className="stat-card">
              <div className="stat-value blue">{stats.total_checks}</div>
              <div className="stat-label">Jobs Checked</div>
            </div>
            <div className="stat-card">
              <div className="stat-value red">{stats.fake_detected}</div>
              <div className="stat-label">Fake Detected</div>
            </div>
            <div className="stat-card">
              <div className="stat-value green">{stats.real_detected}</div>
              <div className="stat-label">Real Verified</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: "var(--warn)" }}>{stats.reports_submitted}</div>
              <div className="stat-label">Scams Reported</div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 8 }}>
            <div className="section-title">My Check History</div>
            {history.length > 0 ? (
              <div className="history-list">
                {history.map((item) => (
                  <div key={item.id} className="history-item">
                    <div className="history-item-top">
                      <span className={`history-label ${item.label.toLowerCase()}`}>
                        {item.label === "FAKE" ? "🚨 FAKE" : "✅ REAL"}
                      </span>
                      <span className="history-date">{formatDate(item.created_at)}</span>
                    </div>
                    <div className="history-text">{item.text}</div>
                    <div className="history-meta">
                      <span>{item.confidence}% confidence</span>
                      {item.red_flags_count > 0 && (
                        <span>{item.red_flags_count} red flag{item.red_flags_count !== 1 ? "s" : ""}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: "32px 16px" }}>
                <div className="icon">📋</div>
                <div>No checks yet. Your history appears here when you&apos;re logged in.</div>
                <Link to="/" className="about-cta" style={{ marginTop: 16 }}>
                  Check a Job Posting →
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
