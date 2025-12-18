import { useEffect } from "react";
import "./AuthModal.css";
import Login from "../Authentication/Login";
import Signup from "../Authentication/Signup";

export default function AuthModal({
  mode,
  onClose,
  onLogin,
  setShowAuthModal,
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
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
    <div className="auth-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal modal-animate">
        <button className="auth-close-btn" onClick={onClose}>
          ×
        </button>

        {mode === "login" ? (
          <Login onLogin={onLogin} inModal switchMode={switchMode} />
        ) : (
          <Signup onLogin={onLogin} inModal switchMode={switchMode} />
        )}
      </div>
    </div>
  );
}