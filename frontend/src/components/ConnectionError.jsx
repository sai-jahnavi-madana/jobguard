import { API } from "../api";

const isLocalApi = /localhost|127\.0\.0\.1/.test(API);

export default function ConnectionError({ message, onRetry }) {
  return (
    <div className="connection-error">
      <div className="connection-error-title">⚠️ {message || "Could not connect to server"}</div>
      <p className="connection-error-desc">
        The backend API is not reachable right now. Check your internet connection, or start the server if you&apos;re running locally.
      </p>
      {isLocalApi && (
        <div className="connection-error-steps">
          <div className="connection-error-steps-title">Local setup</div>
          <code>cd backend</code>
          <code>venv\Scripts\activate</code>
          <code>uvicorn app.main:app --reload --port 8000</code>
        </div>
      )}
      {onRetry && (
        <button type="button" className="btn-retry" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
