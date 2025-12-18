import "./Auth.css";
import axios from "axios";
import Readit from "../../assets/Readit.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup({ onLogin, inModal, switchMode }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [postSignupHint, setPostSignupHint] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setPostSignupHint("");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/authentication/signup`,
        { email, username, password },
        { withCredentials: true }
      );

      setSuccess("Account created successfully 🎉");
      setPostSignupHint(
        "To continue setting up your profile, please go to My Profile > Edit Profile"
      );

      // Hide the hint after 2 seconds
      setTimeout(() => {
        setPostSignupHint("");
      }, 2000);

      onLogin();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      className={`auth-page signup-page ${
        inModal ? "auth-modal-content" : ""
      }`}
    >
      {!inModal && (
        <div className="auth-left">
          <img
            src={Readit}
            alt="Belal's Readit Logo"
            className="auth-logo side-logo"
          />
        </div>
      )}

      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Create Account</h1>
          <p>Join millions of people on Reddit</p>

          {error && <div className="auth-alert auth-error">{error}</div>}
          {success && <div className="auth-alert auth-success">{success}</div>}

          {postSignupHint && (
            <div className="auth-alert auth-success">
              {postSignupHint}
            </div>
          )}

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
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            Sign Up
          </button>

          <p className="auth-small">
            Already have an account?{" "}
            {inModal ? (
              <button
                type="button"
                className="auth-link-switch"
                onClick={switchMode}
              >
                Log in
              </button>
            ) : (
              <a href="/login">Log in</a>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}