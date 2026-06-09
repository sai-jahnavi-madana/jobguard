import { useCallback, useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { api } from "../api";
import ConnectionError from "../components/ConnectionError";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = useCallback(() => {
    setLoading(true);
    setError(null);
    api.stats()
      .then(setStats)
      .catch(() => setError("connection"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <div className="page">
        <div className="loading"><div className="spinner" /> Loading dashboard...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="page">
        <ConnectionError message="Cannot load dashboard" onRetry={loadStats} />
      </div>
    );
  }

  const maxFlag = stats?.top_red_flags?.[0]?.count || 1;

  const pieData = [
    { name: "Fake", value: stats?.fake_detected ?? 0 },
    { name: "Real", value: stats?.real_detected ?? 0 },
  ];

  const barData = stats?.top_red_flags?.slice(0, 6).map((f) => ({
    name: f.flag.length > 20 ? f.flag.slice(0, 20) + "…" : f.flag,
    count: f.count,
  })) || [];

  return (
    <div className="page-wide">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>Scam Dashboard</h1>
        <p style={{ color: "var(--muted)", marginTop: 6 }}>Live stats from all job posts checked through this system.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value blue">{stats?.total_checked ?? 0}</div>
          <div className="stat-label">Total Jobs Checked</div>
        </div>
        <div className="stat-card">
          <div className="stat-value red">{stats?.fake_detected ?? 0}</div>
          <div className="stat-label">Fake Jobs Detected</div>
        </div>
        <div className="stat-card">
          <div className="stat-value green">{stats?.real_detected ?? 0}</div>
          <div className="stat-label">Real Jobs Verified</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: "var(--warn)" }}>{stats?.reports_submitted ?? 0}</div>
          <div className="stat-label">Scams Reported</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 20 }}>

        {/* Pie Chart */}
        <div className="card">
          <div className="section-title">Fake vs Real Ratio</div>
          {stats?.total_checked > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  <Cell fill="#ff4757" />
                  <Cell fill="#2ed573" />
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}
                  labelStyle={{ color: "var(--text)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><div className="icon">🥧</div><div>No data yet.</div></div>
          )}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
            <span style={{ fontSize: 12, color: "var(--fake)", fontFamily: "var(--mono)" }}>● Fake: {stats?.fake_detected ?? 0}</span>
            <span style={{ fontSize: 12, color: "var(--real)", fontFamily: "var(--mono)" }}>● Real: {stats?.real_detected ?? 0}</span>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="card">
          <div className="section-title">Top Red Flags</div>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: "var(--muted)", fontSize: 10 }} width={120} />
                <Tooltip
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}
                />
                <Bar dataKey="count" fill="#ffa502" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><div className="icon">📊</div><div>No data yet.</div></div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        <div className="card">
          <div className="section-title">Top Red Flag Phrases</div>
          {stats?.top_red_flags?.length > 0 ? (
            stats.top_red_flags.map((f) => (
              <div key={f.flag} className="flag-bar-item">
                <div className="flag-bar-label">{f.flag}</div>
                <div className="flag-bar-track">
                  <div className="flag-bar-fill" style={{ width: `${(f.count / maxFlag) * 100}%` }} />
                </div>
                <div className="flag-bar-count">{f.count}</div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="icon">📊</div>
              <div>No data yet. Check some job posts first.</div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="section-title">Reports by City</div>
          {stats?.city_wise && Object.keys(stats.city_wise).length > 0 ? (
            Object.entries(stats.city_wise)
              .sort((a, b) => b[1] - a[1])
              .map(([city, count]) => (
                <div key={city} className="flag-bar-item">
                  <div className="flag-bar-label">📍 {city}</div>
                  <div style={{ fontSize: 14, fontFamily: "var(--mono)", color: "var(--fake)" }}>{count} reports</div>
                </div>
              ))
          ) : (
            <div className="empty-state">
              <div className="icon">🗺️</div>
              <div>No city reports yet.</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="card">
          <div className="section-title">Detection Rate</div>
          {stats?.total_checked > 0 ? (
            <>
              <div style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>
                  {((stats.fake_detected / stats.total_checked) * 100).toFixed(1)}% of checked jobs were flagged as fake
                </span>
              </div>
              <div style={{ height: 16, background: "var(--surface2)", borderRadius: 100, overflow: "hidden", display: "flex" }}>
                <div style={{ width: `${(stats.fake_detected / stats.total_checked) * 100}%`, background: "var(--fake)", transition: "width 0.6s" }} />
                <div style={{ flex: 1, background: "var(--real)" }} />
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                <span style={{ fontSize: 12, color: "var(--fake)", fontFamily: "var(--mono)" }}>● Fake: {stats.fake_detected}</span>
                <span style={{ fontSize: 12, color: "var(--real)", fontFamily: "var(--mono)" }}>● Real: {stats.real_detected}</span>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="icon">📈</div>
              <div>Check some job postings to see detection stats here.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
