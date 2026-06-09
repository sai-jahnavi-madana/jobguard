const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken() {
  return localStorage.getItem("jobguard_token");
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detail = data.detail;
    const msg = typeof detail === "string"
      ? detail
      : Array.isArray(detail)
        ? detail[0]?.msg || "Request failed"
        : data.message || "Request failed";
    throw new Error(msg);
  }
  return data;
}

export const api = {
  predict: (text) => request("/predict", { method: "POST", body: JSON.stringify({ text }) }),
  stats: () => request("/stats"),
  report: (body) => request("/report", { method: "POST", body: JSON.stringify(body) }),
  signup: (body) => request("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  adminStats: () => request("/admin/stats"),
  adminUsers: () => request("/admin/users"),
  adminReports: () => request("/admin/reports"),
  adminPredictions: () => request("/admin/predictions"),
  updateReportStatus: (id, status) =>
    request(`/admin/reports/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteReport: (id) => request(`/admin/reports/${id}`, { method: "DELETE" }),
};

export { API };
