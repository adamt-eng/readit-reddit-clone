/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useLayoutEffect } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import GuestHomePage from "../pages/GuestHomePage/GuestHomePage.jsx";
import AppRoutes from "./routes.jsx";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const mockUser = {
    username: "john_doe",
    avatar: "profile.png",
    karma: 1247,
  };

  // Load initial dark mode (and future: auth persistence)
  useLayoutEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    const isDark = savedDarkMode === "true";

    setDarkMode(isDark);
    document.body.classList.toggle("dark-mode", isDark);

    // If you implement persistent login later:
    // const savedUser = JSON.parse(localStorage.getItem("user"));
    // if (savedUser) {
    //   setCurrentUser(savedUser);
    //   setIsLoggedIn(true);
    // }

    setIsLoading(false);
  }, []);

  // Save dark mode preference + apply to DOM
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
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {isLoggedIn ? (
        <AppRoutes
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      ) : (
        <GuestHomePage onLogin={handleLogin} darkMode={darkMode} />
      )}
    </div>
  );
}

export default App;
