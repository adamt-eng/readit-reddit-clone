import React from "react";
import "./Auth.css";

export default function Signup() {
  return (
    <div className="auth-page signup-page">
      <div className="auth-left">
        {/* Left-side login logo */}
        <img
          src="/reddit-logo-text.png"
          alt="reddit"
          className="auth-logo login-side-logo"
        />

        <h1>Create your account</h1>
        <p>Join millions of people on Reddit</p>
      </div>

      <div className="auth-right">
        <form className="auth-form">
          <input className="auth-input" type="email" placeholder="Email" />
          <input className="auth-input" type="text" placeholder="Username" />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
          />

          <button className="auth-btn">Sign Up</button>

          <p className="auth-small">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
}
