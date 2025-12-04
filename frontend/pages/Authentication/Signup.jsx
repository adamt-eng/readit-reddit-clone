import "./Auth.css";

export default function Signup({ darkMode, inModal, switchMode }) {
  return (
    <div
      className={`auth-page signup-page ${darkMode ? "dark-mode" : ""} ${
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
          <h1>Create your account</h1>
          <p>Join millions of people on Reddit</p>
        </div>
      )}

      <div className="auth-right">
        <form className="auth-form">
          <h1>Create Account</h1>
          <p>Join millions of people on Reddit</p>

          <input className="auth-input" type="email" placeholder="Email" />
          <input className="auth-input" type="text" placeholder="Username" />
          <input className="auth-input" type="password" placeholder="Password" />

          <button className="auth-btn" type="submit">
            Sign Up
          </button>

          <p className="auth-small">
            Already have an account?{" "}
            {inModal ? (
              <button type="button" className="auth-link-switch" onClick={switchMode}>Log in</button>
            ) : (
              <a href="/login">Log in</a>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
