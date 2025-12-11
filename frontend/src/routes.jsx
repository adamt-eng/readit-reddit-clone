import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage/HomePage.jsx";
import GuestHomePage from "../pages/GuestHomePage/GuestHomePage.jsx";
import UserProfilePage from "../components/profile/UserProfilePage.jsx";
import EditProfilePage from "../components/profile/EditProfile/EditProfilePage.jsx";
import CreatePost from "../components/Posts/CreatePost/CreatePost.jsx";
import DirectMessages from "../pages/Direct Messages/DirectMessages.jsx";
import CreateCommunityModal from "../components/Community/CreateCommunityModal/CreateCommunityModal.jsx";
import Login from "../pages/Authentication/Login.jsx";
import Signup from "../pages/Authentication/Signup.jsx";
import SearchResults from "../pages/SearchResults/SearchResults.jsx"
import CommunityPage from "../pages/CommunityPage/CommunityPage.jsx"
import Notifications from "../pages/Notifications/Notifications.jsx"


export default function AppRoutes({
  darkMode,
  toggleDarkMode,
  currentUser,
  onLogout,
  onLogin,
  isLoggedIn,
}) {
  const [showCommunityModal, setShowCommunityModal] = useState(false);

  const openCommunityModal = () => setShowCommunityModal(true);
  const closeCommunityModal = () => setShowCommunityModal(false);

  return (
    <>
      <Routes>
        {/* Home page - shows different content based on login status */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <HomePage
                onLogout={onLogout}
                darkMode={darkMode}
                onStartCommunity={openCommunityModal}
              />
            ) : (
              <GuestHomePage 
                onLogin={onLogin} 
                darkMode={darkMode} 
              />
            )
          }
        />

        {/* Guest route for logged-out users */}
        <Route
          path="/guest"
          element={
            !isLoggedIn ? (
              <GuestHomePage 
                onLogin={onLogin} 
                darkMode={darkMode} 
              />
            ) : (
              // Redirect to home if already logged in
              <HomePage
                user={currentUser}
                onLogout={onLogout}
                darkMode={darkMode}
                onStartCommunity={openCommunityModal}
              />
            )
          }
        />

        {/* User profile - protected route */}
        <Route
          path="/user/:username"
          element={
            isLoggedIn ? (
              <UserProfilePage
                isDark={darkMode}
                toggleDarkMode={toggleDarkMode}
                currentUser={currentUser}
              />
            ) : (
              // Show guest home with login prompt
              <GuestHomePage 
                onLogin={onLogin} 
                darkMode={darkMode} 
              />
            )
          }
        />

        {/* User profile - protected route */}
        <Route
          path="/community/:communityName"
          element={
            isLoggedIn ? (
              <CommunityPage
              />
            ) : (
              // Show guest home with login prompt
              <GuestHomePage 
                onLogin={onLogin} 
                darkMode={darkMode} 
              />
            )
          }
        />
         {/*  Notis - protected route */}
        <Route
          path="/notifications"
          element={
            isLoggedIn ? (
              <Notifications
              />
            ) : (
              // Show guest home with login prompt
              <GuestHomePage 
                onLogin={onLogin} 
                darkMode={darkMode} 
              />
            )
          }
        />
        {/* Edit profile - protected route */}
        <Route
          path="/edit-profile"
          element={
            isLoggedIn ? (
              <EditProfilePage
                isDark={darkMode}
                toggleDarkMode={toggleDarkMode}
                currentUser={currentUser}
              />
            ) : (
              // Show guest home with login prompt
              <GuestHomePage 
                onLogin={onLogin} 
                darkMode={darkMode} 
              />
            )
          }
        />

        {/* Create post - protected route */}
        <Route
          path="/create-post"
          element={
            isLoggedIn ? (
              <CreatePost
                isDark={darkMode}
                toggleDarkMode={toggleDarkMode}
                currentUser={currentUser}
              />
            ) : (
              // Show guest home with login prompt
              <GuestHomePage 
                onLogin={onLogin} 
                darkMode={darkMode} 
              />
            )
          }
        />

        {/* Direct messages - protected route */}
        <Route
          path="/messages"
          element={
            isLoggedIn ? (
              <DirectMessages darkMode={darkMode} />
            ) : (
              // Show guest home with login prompt
              <GuestHomePage 
                onLogin={onLogin} 
                darkMode={darkMode} 
              />
            )
          }
        />

        {/* Authentication pages */}
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <Login onLogin={onLogin} darkMode={darkMode} />
            ) : (
              // Redirect to home if already logged in
              <HomePage
                user={currentUser}
                onLogout={onLogout}
                darkMode={darkMode}
                onStartCommunity={openCommunityModal}
              />
            )
          }
        />
        
        <Route 
          path="/signup" 
          element={
            !isLoggedIn ? (
              <Signup darkMode={darkMode} onSignup={onLogin} />
            ) : (
              // Redirect to home if already logged in
              <HomePage
                user={currentUser}
                onLogout={onLogout}
                darkMode={darkMode}
                onStartCommunity={openCommunityModal}
              />
            )
          }
        />
        <Route
        path="/search"
        element={
          isLoggedIn ? (
              <SearchResults />
            ) : (
              // Show guest home with login prompt
              <GuestHomePage 
                onLogin={onLogin} 
                darkMode={darkMode} 
              />
            )
        }></Route>
      </Routes>
  
    </>
  );
}