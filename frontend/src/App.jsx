/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useLayoutEffect } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import GuestHomePage from "../pages/GuestHomePage/GuestHomePage.jsx";
import AppRoutes from "./routes.jsx";            // 👈 NEW: use routes file
import "./App.css";

function App() {
  // mock logged-in user
  const mockUser = {
    username: "john_doe",
    avatar: "profile.png",
    karma: 1247
  };

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState(mockUser);   // 👈 start with mock user
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial dark mode
  useLayoutEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    const isDarkMode = savedDarkMode === "true";
    setDarkMode(isDarkMode);

    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    setIsLoading(false);
  }, []);

  // Save dark mode preference
  useLayoutEffect(() => {
    if (!isLoading) {
      localStorage.setItem("darkMode", darkMode);

      if (darkMode) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
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

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  if (isLoading) {
    return <div className="app-loading" />;
  }

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {isLoggedIn ? (
        //  WHEN LOGGED IN → use routes (Home, Profile, etc.)
        <AppRoutes
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      ) : (
        //  WHEN LOGGED OUT → show guest home
        <GuestHomePage onLogin={handleLogin} darkMode={darkMode} />
      )}
    </div>
  );
}

export default App;
