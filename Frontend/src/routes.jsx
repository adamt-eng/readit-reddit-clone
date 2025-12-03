// Frontend/src/routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage/HomePage.jsx";
import UserProfilePage from "../components/profile/UserProfilePage.jsx";

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

      {/* You can add more routes here later */}
    </Routes>
  );
}
