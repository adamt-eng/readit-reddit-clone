// Frontend/src/routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage/HomePage.jsx";
import UserProfilePage from "../components/profile/UserProfilePage.jsx";
import EditProfilePage from "../components/profile/EditProfile/EditProfilePage.jsx";
import CreatePost from "../components/Posts/CreatePost/CreatePost.jsx"; 


export default function AppRoutes({
  darkMode,
  toggleDarkMode,
  currentUser,
  onLogout,
}) {
  return (
    <Routes>
      {/* Feed / Home */}
      <Route
        path="/"
        element={
          <HomePage
            user={currentUser}
            onLogout={onLogout}
            darkMode={darkMode}
          />
        }
      />

      {/* User profile page: /user/:username */}
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

      {/* */}
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
      {/* You can add more routes here later */}
    </Routes>
  );
}