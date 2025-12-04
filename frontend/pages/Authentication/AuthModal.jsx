import "./AuthModal.css";
import Login from "../Authentication/Login";
import Signup from "../Authentication/Signup";

export default function AuthModal({ mode, onClose, onLogin, darkMode }) {
  const switchMode = () => {
    if (mode === "login") {
      onClose(); // Close current modal
      setTimeout(() => {
        document.querySelector(".signup-btn")?.click(); // Trigger Signup open from navbar
      }, 10);
    } else {
      onClose();
      setTimeout(() => {
        document.querySelector(".login-btn")?.click(); // Trigger Login open
      }, 10);
    }
  };

  return (
    <div
      className={`auth-overlay ${darkMode ? "dark-mode" : ""}`}
      onClick={onClose}
    >
      <div
        className="auth-modal"
        onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside
      >
        {mode === "login" ? (
          <Login
            onLogin={onLogin}
            darkMode={darkMode}
            inModal
            switchMode={switchMode}
          />
        ) : (
          <Signup darkMode={darkMode} inModal switchMode={switchMode} />
        )}
      </div>
    </div>
  );
}
