import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LeftSidebar from "../LeftSidebar/LeftSidebar";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import ProfileContent from "./ProfileContent";
import ProfileSidebar from "./ProfileSidebar";

import "./styles/profile.css";
import "./styles/header.css";
import "./styles/tabs.css";
import "./styles/content.css";
import "./styles/sidebar.css";
import "./styles/dark.css";

const API_BASE = "http://localhost:5000";

export default function UserProfilePage({ isDark, toggleDarkMode }) {
  const { id: userId } = useParams();   // 🔑 ID from URL
  const [activeTab, setActiveTab] = useState("Overview");

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/users/${userId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "User not found");
        }

        setUser(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
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
        style={{
          position: "fixed",
          top: "70px",
          right: "20px",
          zIndex: 10000,
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

              <ProfileTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              <ProfileContent
                activeTab={activeTab}
                user={user}
              />
            </main>

            <aside className="profile-aside">
              {user && <ProfileSidebar user={user} />}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
