import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileTabs from "../../components/profile/ProfileTabs";
import ProfileContent from "../../components/profile/ProfileContent";
import ProfileSidebar from "../../components/profile/ProfileSidebar";

import "../../components/profile/styles/profile.css";
import "../../components/profile/styles/header.css";
import "../../components/profile/styles/tabs.css";
import "../../components/profile/styles/content.css";
import "../../components/profile/styles/sidebar.css";
import "../../components/profile/styles/dark.css";

const API_BASE = "http://localhost:5000";

export default function UserProfilePage({ isDark, toggleDarkMode, currentUser }) {
  const { id: userId } = useParams(); // ✅ this is the param name in routes: /user/:id
  const [activeTab, setActiveTab] = useState("Overview");

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        setError("");

        // ✅ use userId (NOT id)
        const url =
          userId === "me"
            ? `${API_BASE}/users/me`
            : `${API_BASE}/users/${userId}`;

        const res = await fetch(url, {
          credentials: "include", // ✅ send cookie
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch user");

        setUser(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [userId]);

  if (loading) return <div>Loading profile...</div>;

  return (
    <>
      <button
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
        style={{
          position: "fixed",
          top: "70px",
          right: "20px",
          zIndex: 10000,
          padding: "10px 16px",
          borderRadius: "999px",
          background: isDark ? "#d7dadc" : "#1a1a1b",
          color: isDark ? "#000" : "#fff",
          border: "none",
          fontWeight: "bold",
          fontSize: "14px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        {isDark ? "Light Mode" : "Dark Mode"}
      </button>

      <div className="profile-page-wrapper">
        <LeftSidebar />

        <div className="profile-page">
          <div className="profile-container">
            <main className="profile-main">
              {error && <div style={{ color: "red" }}>{error}</div>}

              {user && <ProfileHeader user={user} />}

              <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

              <ProfileContent activeTab={activeTab} user={user} />
            </main>

            <aside className="profile-aside">
              {/* ✅ pass currentUser so sidebar can decide if it's "my profile" */}
              {user && <ProfileSidebar user={user} currentUser={currentUser} />}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
