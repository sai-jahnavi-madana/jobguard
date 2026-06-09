import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TABS = [
  { to: "/", label: "Check Job", end: true },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/report", label: "Report Scam" },
  { to: "/about", label: "About" },
];

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <nav className="nav">
      <NavLink to="/" className="nav-logo">
        <span>⚠</span> Job<span>Guard</span>
      </NavLink>

      {/* Desktop nav */}
      <div className="nav-tabs desktop-nav">
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
          <NavLink to="/admin" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>
            Admin
          </NavLink>
        )}
        {user ? (
          <div className="nav-user">
            <NavLink to="/profile" className={({ isActive }) => `nav-profile ${isActive ? "active" : ""}`}>
              {user.name}
            </NavLink>
            <button type="button" className="nav-logout" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <NavLink to="/login" className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}>Login</NavLink>
        )}
      </div>

      {/* Hamburger button */}
      <button className="hamburger" onClick={() => setOpen(!open)}>
        {open ? "✕" : "☰"}
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="mobile-menu">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) => `mobile-tab ${isActive ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {t.label}
            </NavLink>
          ))}
          {user?.is_admin && (
            <NavLink to="/admin" className={({ isActive }) => `mobile-tab ${isActive ? "active" : ""}`} onClick={() => setOpen(false)}>
              Admin
            </NavLink>
          )}
          {user ? (
            <>
              <NavLink to="/profile" className={({ isActive }) => `mobile-tab ${isActive ? "active" : ""}`} onClick={() => setOpen(false)}>
                👤 {user.name}
              </NavLink>
              <button className="mobile-tab logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `mobile-tab ${isActive ? "active" : ""}`} onClick={() => setOpen(false)}>
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}
