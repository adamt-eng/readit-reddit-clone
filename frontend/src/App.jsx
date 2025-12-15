import { useState, useLayoutEffect, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import AppRoutes from "./routes.jsx";
import AuthModal from "../pages/Authentication/AuthModal.jsx";
import "./App.css";
import axios from "axios"

function App() {
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

 

  
useEffect(() => {
  const fetchMe = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/users/me",
        { withCredentials: true }
      );
      setCurrentUser(res.data);
    } catch (err) {
      console.log("Error fetching user:", err);
    }
  };

  fetchMe();
}, []);

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

  const handleLogin = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users/me", {
        withCredentials: true,
      });
      setCurrentUser(res.data);
      setIsLoggedIn(true);
    } catch {
      setCurrentUser(null);
    } finally {
      closeAuthModal();
    }
  };


  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  if (isLoading) return <div className="app-loading" />;

   return (
    <div className={`app${darkMode ? "dark-mode" : ""}`}>
      {/* NAVBAR always visible except when visiting actual auth pages */}
      {!isAuthPage && (
        !currentUser?(<Navbar
          user={currentUser}
          isLoggedIn={false}
          setCurrentUser={setCurrentUser}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onLoginClick={openLoginModal}
          onSignupClick={openSignupModal}
        />):(<Navbar
          user={currentUser}
          isLoggedIn={true}
          setCurrentUser={setCurrentUser}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onLoginClick={openLoginModal}
          onSignupClick={openSignupModal}
        />)
      )}

      {/* Routes for ALL pages */}
      {!currentUser?(<AppRoutes
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onLogin={handleLogin}
        isLoggedIn={false}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser} 
      />):(<AppRoutes
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onLogin={handleLogin}
        isLoggedIn={true}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser} 
        />)}


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
