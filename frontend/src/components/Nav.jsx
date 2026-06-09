import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TABS = [
  { to: "/", label: "Check Job", end: true },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/report", label: "Report Scam" },
];

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="nav">
      <NavLink to="/" className="nav-logo">
        <span>⚠</span> Job<span>Guard</span>
      </NavLink>

      <div className="nav-tabs">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}
          >
            {t.label}
          </NavLink>
        ))}

        {user?.is_admin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}
          >
            Admin
          </NavLink>
        )}

        {user ? (
          <div className="nav-user">
            <span>{user.name}</span>
            <button type="button" className="nav-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}
