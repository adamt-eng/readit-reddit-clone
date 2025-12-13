import "./Auth.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function Login({ onLogin, darkMode, inModal, switchMode }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/authentication/login",
        { email, password },
        { withCredentials: true } // VERY IMPORTANT
      );
      onLogin();

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
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

          {error && <p className="auth-error">{error}</p>}

          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-btn" type="submit">
            Log In
          </button>

          <p className="auth-small">
            New to Reddit?{" "}
            {inModal ? (
              <button
                type="button"
                className="auth-link-switch"
                onClick={switchMode}
              >
                Sign up
              </button>
            ) : (
              <a href="/signup">Sign up</a>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
