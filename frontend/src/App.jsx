/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import GuestHomePage from "../pages/GuestHomePage/GuestHomePage.jsx";
import AppRoutes from "./routes.jsx";
import AuthModal from "../pages/Authentication/AuthModal.jsx";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // "false" = hidden, "login" = login modal, "signup" = signup modal
  const [showAuthModal, setShowAuthModal] = useState(false);

  const openLoginModal = () => setShowAuthModal("login");
  const openSignupModal = () => setShowAuthModal("signup");
  const closeAuthModal = () => setShowAuthModal(false);

  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  const mockUser = {
    username: "john_doe",
    avatar: "profile.png",
    karma: 1247,
  };

  useLayoutEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    const isDark = savedDarkMode === "true";
    setDarkMode(isDark);
    document.body.classList.toggle("dark-mode", isDark);
    setIsLoading(false);
  }, []);

  useLayoutEffect(() => {
    if (!isLoading) {
      localStorage.setItem("darkMode", darkMode);
      document.body.classList.toggle("dark-mode", darkMode);
    }
  }, [darkMode, isLoading]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentUser(mockUser);
    closeAuthModal();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  if (isLoading) return <div className="app-loading" />;

   return (
    <div className={`app${darkMode ? "dark-mode" : ""}`}>
      {/* NAVBAR always visible except when visiting actual auth pages */}
      {!isAuthPage && (
        <Navbar
          user={currentUser}
          onLogout={handleLogout}
          isLoggedIn={isLoggedIn}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onLoginClick={openLoginModal}
          onSignupClick={openSignupModal}
        />
      )}

      {/* Routes for ALL pages */}
      <AppRoutes
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
        onLogin={handleLogin}
        isLoggedIn={isLoggedIn}
      />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={showAuthModal}
          onClose={closeAuthModal}
          onLogin={handleLogin}
          darkMode={darkMode}
          setShowAuthModal={setShowAuthModal}
        />
      )}
    </div>
  );
}

export default App;
