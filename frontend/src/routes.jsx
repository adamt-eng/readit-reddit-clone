import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage/HomePage.jsx";
import UserProfilePage from "../components/profile/UserProfilePage.jsx";
import EditProfilePage from "../components/profile/EditProfile/EditProfilePage.jsx";
import CreatePost from "../components/Posts/CreatePost/CreatePost.jsx";
import DirectMessages from "../pages/Direct Messages/DirectMessages.jsx";
import CreateCommunityModal from "../components/Community/CreateCommunityModal/CreateCommunityModal.jsx";
import Login from "../pages/Authentication/Login.jsx";
import Signup from "../pages/Authentication/Signup.jsx";

export default function AppRoutes({
  darkMode,
  toggleDarkMode,
  currentUser,
  onLogout,
  onLogin,
}) {
  const [showCommunityModal, setShowCommunityModal] = useState(false);

  const openCommunityModal = () => setShowCommunityModal(true);
  const closeCommunityModal = () => setShowCommunityModal(false);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              user={currentUser}
              onLogout={onLogout}
              darkMode={darkMode}
              onStartCommunity={openCommunityModal}
            />
          }
        />

        <Route
          path="/user/:username"
          element={
            <UserProfilePage
              isDark={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />

        <Route
          path="/edit-profile"
          element={
            <EditProfilePage
              isDark={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />

        <Route
          path="/create-post"
          element={
            <CreatePost
              isDark={darkMode}
              toggleDarkMode={toggleDarkMode}
              currentUser={currentUser}
            />
          }
        />

        <Route
          path="/login"
          element={<Login onLogin={onLogin} darkMode={darkMode} />}
        />
        <Route path="/signup" element={<Signup darkMode={darkMode} />} />

        <Route
          path="/messages"
          element={<DirectMessages darkMode={darkMode} />}
        />
      </Routes>

      {showCommunityModal && (
        <CreateCommunityModal onClose={closeCommunityModal}  darkMode={darkMode}/>
      )}
    </>
  );
}
