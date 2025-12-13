import { useEffect } from "react";
import "./AuthModal.css";
import Login from "../Authentication/Login";
import Signup from "../Authentication/Signup";

export default function AuthModal({ mode, onClose, onLogin, darkMode, setShowAuthModal }) {

  // Animation trigger
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Disable background scroll
    return () => {
      document.body.style.overflow = ""; // Re-enable scroll
    };
  }, []);

  const switchMode = () => {
    setShowAuthModal(mode === "login" ? "signup" : "login");
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("auth-overlay")) {
      onClose();
    }
  };

  return (
    <div
      className={`auth-overlay ${darkMode ? "dark-mode" : ""}`}
      onClick={handleOverlayClick}
    >
      <div className="auth-modal modal-animate">
        <button className="auth-close-btn" onClick={onClose}>×</button>

        {mode === "login" ? (
          <Login
            onLogin={onLogin}
            darkMode={darkMode}
            inModal
            switchMode={switchMode}
          />
        ) : (
          <Signup onLogin={onLogin} darkMode={darkMode} inModal switchMode={switchMode} />
        )}
      </div>
    </div>
  );
}
