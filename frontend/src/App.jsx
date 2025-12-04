/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import GuestHomePage from "../pages/GuestHomePage/GuestHomePage.jsx";
import AppRoutes from "./routes.jsx";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

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
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  if (isLoading) {
    return <div className="app-loading" />;
  }

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      {!isAuthPage && (
        <Navbar
          user={currentUser}
          onLogout={handleLogout}
          isLoggedIn={isLoggedIn}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}

      {isLoggedIn && !isAuthPage && (
        <AppRoutes
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          currentUser={currentUser}
          onLogout={handleLogout}
          onLogin={handleLogin}
        />
      )}

      {!isLoggedIn && !isAuthPage && (
        <GuestHomePage onLogin={handleLogin} darkMode={darkMode} />
      )}

      {isAuthPage && (
        <AppRoutes
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          currentUser={currentUser}
          onLogout={handleLogout}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

export default App;
