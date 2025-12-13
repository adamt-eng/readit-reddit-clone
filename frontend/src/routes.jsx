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
import SearchResults from "../pages/SearchResults/SearchResults.jsx";
import CommunityPage from "../pages/CommunityPage/CommunityPage.jsx";
import Notifications from "../pages/Notifications/Notifications.jsx";

// ⭐ ONLY NEW IMPORT YOU NEEDED
import PostPage from "../pages/PostPage.jsx";

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
              <GuestHomePage onLogin={onLogin} darkMode={darkMode} />
            )
          }
        />

        {/* Guest route for logged-out users */}
        <Route
          path="/guest"
          element={
            !isLoggedIn ? (
              <GuestHomePage onLogin={onLogin} darkMode={darkMode} />
            ) : (
              <HomePage
                user={currentUser}
                onLogout={onLogout}
                darkMode={darkMode}
                onStartCommunity={openCommunityModal}
              />
            )
          }
        />

        {/* User profile */}
        <Route
          path="/user/:id"
          element={
            isLoggedIn ? (
              <UserProfilePage
                isDark={darkMode}
                toggleDarkMode={toggleDarkMode}
                currentUser={currentUser}
              />
            ) : (
              <GuestHomePage onLogin={onLogin} darkMode={darkMode} />
            )
          }
        />

        {/* Community Page */}
        <Route
          path="/community/:communityName"
          element={
            isLoggedIn ? (
              <CommunityPage />
            ) : (
              <GuestHomePage onLogin={onLogin} darkMode={darkMode} />
            )
          }
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            isLoggedIn ? (
              <Notifications />
            ) : (
              <GuestHomePage onLogin={onLogin} darkMode={darkMode} />
            )
          }
        />

        {/* Edit profile */}
        <Route
          path="/edit-profile/:id"
          element={
            isLoggedIn ? (
              <EditProfilePage
                isDark={darkMode}
                toggleDarkMode={toggleDarkMode}
                currentUser={currentUser}
              />
            ) : (
              <GuestHomePage onLogin={onLogin} darkMode={darkMode} />
            )
          }
        />

        {/* Create post */}
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
              <GuestHomePage onLogin={onLogin} darkMode={darkMode} />
            )
          }
        />

        {/* Direct Messages */}
        <Route
          path="/messages"
          element={
            isLoggedIn ? (
              <DirectMessages darkMode={darkMode} currentUser={currentUser} />
            ) : (
              <GuestHomePage onLogin={onLogin} darkMode={darkMode} />
            )
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <Login onLogin={onLogin} darkMode={darkMode} />
            ) : (
              <HomePage
                user={currentUser}
                onLogout={onLogout}
                darkMode={darkMode}
                onStartCommunity={openCommunityModal}
              />
            )
          }
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={
            !isLoggedIn ? (
              <Signup darkMode={darkMode} onSignup={onLogin} />
            ) : (
              <HomePage
                user={currentUser}
                onLogout={onLogout}
                darkMode={darkMode}
                onStartCommunity={openCommunityModal}
              />
            )
          }
        />

        {/* Search */}
        <Route
          path="/search"
          element={
            isLoggedIn ? (
              <SearchResults />
            ) : (
              <GuestHomePage onLogin={onLogin} darkMode={darkMode} />
            )
          }
        />

        {/* ⭐ THE ONLY ROUTE YOU WERE MISSING */}
        <Route
          path="/posts/:postId"
          element={
            isLoggedIn ? (
              <PostPage />
            ) : (
              <GuestHomePage onLogin={onLogin} darkMode={darkMode} />
            )
          }
        />

      </Routes>
      {showCommunityModal && (
      <CreateCommunityModal onClose={closeCommunityModal} darkMode={darkMode} />
)}

    </>
  );
}
