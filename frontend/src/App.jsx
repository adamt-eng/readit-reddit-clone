import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar.jsx";
import FloatingDM from "../components/FloatingDM/FloatingDM.jsx";
import AppRoutes from "./routes.jsx";
import AuthModal from "../pages/Authentication/AuthModal.jsx";
import axios from "axios";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isFloatingDMOpen, setIsFloatingDMOpen] = useState(false);

  // "false" = hidden, "login" = login modal, "signup" = signup modal
  const [showAuthModal, setShowAuthModal] = useState(false);

  const openLoginModal = () => setShowAuthModal("login");
  const openSignupModal = () => setShowAuthModal("signup");
  const closeAuthModal = () => setShowAuthModal(false);

  const openFloatingDM = () => {
    if (!currentUser) {
      openLoginModal();
      return;
    }
    setIsFloatingDMOpen(true);
  };

  const closeFloatingDM = () => setIsFloatingDMOpen(false);

  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/me`,
          { withCredentials: true },
        );
        console.log("Fetched user: ", res.data);

        setCurrentUser(res.data);
      } catch {
        console.log("Not logged in");
      }
    };

    fetchMe();
  }, []);


  const handleLogin = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
        withCredentials: true,
      });
      setCurrentUser(res.data);
    } catch {
      setCurrentUser(null);
    } finally {
      closeAuthModal();
    }
  };

  return (
    <div className={"app"}>
      {!isAuthPage &&
        (<Navbar
            user={currentUser}
            setUser={setCurrentUser}
            onLoginClick={openLoginModal}
            onSignupClick={openSignupModal}
            onOpenFloatingDM={openFloatingDM}
          />)}

      {currentUser && (
        <FloatingDM
          isOpen={isFloatingDMOpen}
          onClose={closeFloatingDM}
          user={currentUser}
        />
      )}

      <AppRoutes
        onLogin={handleLogin}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setShowAuth={setShowAuthModal}
      />

      {showAuthModal && (
        <AuthModal
          mode={showAuthModal}
          onClose={closeAuthModal}
          onLogin={handleLogin}
          setShowAuthModal={setShowAuthModal}
        />
      )}
    </div>
  );
}

export default App;