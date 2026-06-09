import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

function StatusBadge({ status }) {
  return <span className={`status-badge status-${status}`}>{status}</span>;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, u, r, p] = await Promise.all([
        api.adminStats(),
        api.adminUsers(),
        api.adminReports(),
        api.adminPredictions(),
      ]);
      setStats(s);
      setUsers(u);
      setReports(r);
      setPredictions(p);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.is_admin) load();
  }, [user]);

  const updateStatus = async (id, status) => {
    await api.updateReportStatus(id, status);
    load();
  };

  const removeReport = async (id) => {
    if (!confirm("Delete this report?")) return;
    await api.deleteReport(id);
    load();
  };

  if (authLoading) {
    return <div className="page"><div className="loading"><div className="spinner" /></div></div>;
  }
  if (!user?.is_admin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page-wide">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Admin Panel</h1>
        <p style={{ color: "var(--muted)", marginTop: 6 }}>Manage users, reports, and predictions.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="admin-tabs">
        {["overview", "reports", "predictions", "users"].map((t) => (
          <button
            key={t}
            type="button"
            className={`admin-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /> Loading admin data...</div>
      ) : (
        <>
          {tab === "overview" && stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value blue">{stats.total_users}</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-value blue">{stats.total_predictions}</div>
                <div className="stat-label">Predictions</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: "var(--warn)" }}>{stats.total_reports}</div>
                <div className="stat-label">Total Reports</div>
              </div>
              <div className="stat-card">
                <div className="stat-value red">{stats.pending_reports}</div>
                <div className="stat-label">Pending Reports</div>
              </div>
            </div>
          )}

          {tab === "reports" && (
            <div className="card admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Company</th>
                    <th>City</th>
                    <th>Status</th>
                    <th>Text</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td>{r.company || "—"}</td>
                      <td>{r.city || "—"}</td>
                      <td><StatusBadge status={r.status} /></td>
                      <td style={{ maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.text.slice(0, 80)}...
                      </td>
                      <td>
                        <div className="admin-actions">
                          {["pending", "reviewed", "resolved"].map((s) => (
                            <button
                              key={s}
                              type="button"
                              className="admin-btn"
                              onClick={() => updateStatus(r.id, s)}
                            >
                              {s}
                            </button>
                          ))}
                          <button type="button" className="admin-btn danger" onClick={() => removeReport(r.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!reports.length && <div className="empty-state">No reports yet.</div>}
            </div>
          )}

          {tab === "predictions" && (
            <div className="card admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Label</th>
                    <th>Confidence</th>
                    <th>Red Flags</th>
                    <th>Text</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((p) => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td style={{ color: p.label === "FAKE" ? "var(--fake)" : "var(--real)", fontWeight: 600 }}>
                        {p.label}
                      </td>
                      <td>{p.confidence}%</td>
                      <td>{p.red_flags?.length || 0}</td>
                      <td style={{ maxWidth: 240 }}>{p.text}</td>
                      <td style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!predictions.length && <div className="empty-state">No predictions yet.</div>}
            </div>
          )}

          {tab === "users" && (
            <div className="card admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.is_admin ? "Admin" : "User"}</td>
                      <td style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
