import { useState, useLayoutEffect, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import GuestHomePage from "../pages/GuestHomePage/GuestHomePage.jsx";
import AppRoutes from "./routes.jsx";
import AuthModal from "../pages/Authentication/AuthModal.jsx";
import "./App.css";
import axios from "axios"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  /* const mockUser = {
    _id: "693c92f1c4258e79913cd1d7", // put a REAL ID from MongoDB Compass
    username: "john_doe",
    avatarUrl: "", // backend uses avatarUrl
    karma: 1247,
  }; */

  // Try to load a real user from the backend for local testing
  // for DM testing -- adam
  // DMS WILL ONLY WORK EITHER WITH THIS OR WITH AUTH!!!!!!!!!
/*   useEffect(() => {
    async function loadUser() {
      try {
        const res = await axios.get(
          "http://localhost:5000/users/search?q=b&page=1&limit=1"
        );
        const users = res.data && res.data.results ? res.data.results : [];
        if (users.length) {
          setCurrentUser(users[0]);
          setIsLoggedIn(true);
        } else {
          setCurrentUser(mockUser);
        }

        const currentPort = window.location.port;
        console.log(`Attempting to load user from backend to port number ${currentPort ?? "aaa"}...`);
        
      } catch (err) {
        console.error("Failed to load user from backend, falling back to mock:", err);
        setCurrentUser(mockUser);
      }
    }

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); */

 
useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users/me", {
          withCredentials: true,
        });

        setCurrentUser(res.data);
        setIsLoggedIn(true);
      } catch (err) {
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    };

    loadMe();
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
    } catch (err) {
      setCurrentUser(null);
      setIsLoggedIn(false);
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
        <Navbar
          user={currentUser}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn = {setIsLoggedIn}
          setCurrentUser={setCurrentUser}
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
        onLogin={handleLogin}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
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
