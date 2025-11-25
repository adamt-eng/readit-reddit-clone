import React, { useState, useLayoutEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import GuestHomePage from "../pages/GuestHomePage/GuestHomePage";
import HomePage from "../pages/HomePage/HomePage";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const mockUser = {
    username: "john_doe",
    avatar: "profile.png",
    karma: 1247
  };

  // Load all initial data synchronously
  useLayoutEffect(() => {
    // Load dark mode
    const savedDarkMode = localStorage.getItem('darkMode');
    const isDarkMode = savedDarkMode === 'true';
    setDarkMode(isDarkMode);
    
    // Apply to body immediately
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Check if user is logged in (if you had auth persistence)
    // const savedUser = localStorage.getItem('user');
    // if (savedUser) {
    //   setCurrentUser(JSON.parse(savedUser));
    //   setIsLoggedIn(true);
    // }
    
    setIsLoading(false); // Mark loading as complete
  }, []);

  // Save dark mode preference
  useLayoutEffect(() => {
    if (!isLoading) { // Only save after initial load
      localStorage.setItem('darkMode', darkMode);
      
      if (darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
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
    setDarkMode(prev => !prev);
  };

  // Show loading spinner or nothing while initializing
  if (isLoading) {
    return (
      <div className="app-loading">
        {/* Optional: Add a loading spinner here */}
      </div>
    );
  }

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar 
        user={currentUser} 
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      {isLoggedIn ? (
        <HomePage user={currentUser} onLogout={handleLogout} darkMode={darkMode} />
      ) : (
        <GuestHomePage onLogin={handleLogin} darkMode={darkMode} />
      )}
    </div>
  );
}

export default App;