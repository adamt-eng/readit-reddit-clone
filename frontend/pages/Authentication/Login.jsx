import "./Auth.css";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin, darkMode, inModal, switchMode }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
    navigate("/");
  };

  return (
    <div
      className={`auth-page login-page ${darkMode ? "dark-mode" : ""} ${
        inModal ? "auth-modal-content" : ""
      }`}
    >
      {!inModal && (
        <div className="auth-left">
          <img
            src="/assets/reddit-logo-text.png"
            alt="reddit"
            className="auth-logo side-logo"
          />
          <h1>Welcome back</h1>
          <p>Log in to your Reddit account</p>
        </div>
      )}

      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Welcome Back</h1>
          <p>Log in to your Reddit account</p>

          <input className="auth-input" type="email" placeholder="Email" />
          <input className="auth-input" type="password" placeholder="Password" />

          <button className="auth-btn" type="submit">
            Log In
          </button>

          <p className="auth-small">Forgot your password?</p>
          <p className="auth-small">
            New to Reddit?{" "}
            {inModal ? (
              <button type="button" className="auth-link-switch" onClick={switchMode}>Sign up</button>
            ) : (
              <a href="/signup">Sign up</a>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
