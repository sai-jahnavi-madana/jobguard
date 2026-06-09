import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPasswordStrength } from "../utils/passwordStrength";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const strength = getPasswordStrength(form.password);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await signup(form.name, form.email, form.password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Authentication failed");
    }
    setLoading(false);
  };

  const switchMode = (next) => {
    setMode(next);
    setError(null);
    setShowPassword(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{mode === "login" ? "Welcome back" : "Create account"}</h1>
        <p>
          {mode === "login"
            ? "Sign in to save your check history and track your reports."
            : "Join JobGuard to help protect job seekers from scams."}
        </p>
        <p className="auth-hint-te">
          {mode === "login"
            ? "లాగిన్ అయితే మీ జాబ్ చెక్ హిస్టరీ సేవ్ అవుతుంది."
            : "ఖాతా తెరిచి మరింత మందికి సహాయం చేయండి."}
        </p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={submit}>
          {mode === "signup" && (
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input
                id="name"
                className="form-input"
                placeholder="Your name"
                value={form.name}
                onChange={set("name")}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="password-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input password-input"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={set("password")}
                minLength={6}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {mode === "signup" && form.password && (
              <div className="password-strength">
                <div className="password-strength-bar">
                  <div
                    className={`password-strength-fill ${strength.className}`}
                    style={{ width: `${(strength.score / 5) * 100}%` }}
                  />
                </div>
                <span className={`password-strength-label ${strength.className}`}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          <button type="submit" className="btn-check" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button type="button" onClick={() => switchMode("signup")}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => switchMode("login")}>
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
