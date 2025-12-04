
import "./Auth.css";

export default function Login() {
  return (
    <div className="auth-page login-page">
      <div className="auth-left">
        {/* Left-side login logo */}
        <img
          src="/reddit-logo-text.png"
          alt="reddit"
          className="auth-logo login-side-logo"
        />

        <h1>Welcome back</h1>
        <p>Log in to your Reddit account</p>
      </div>

      <div className="auth-right">
        <form className="auth-form">
          <input className="auth-input" type="email" placeholder="Email" />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
          />
          <button className="auth-btn">Log In</button>

          <p className="auth-small">Forgot your password?</p>
          <p className="auth-small">
            New to Reddit? <a href="/signup">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
