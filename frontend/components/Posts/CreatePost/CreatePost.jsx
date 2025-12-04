// components/CreatePost/CreatePost.jsx

import React, { useState } from "react";
import LeftSidebar from "../../LeftSidebar/LeftSidebar";
import PostTabs from "../PostTabs/PostTabs";
import FormPostText from "../FormPostText/FormPostText";
import FormPostImage from "../FormPostImage/FormPostImage";
import FormPostLink from "../FormPostLink/FormPostLink";

import "./CreatePost.css";

export default function CreatePost({ isDark, toggleDarkMode }) {
  const [activeTab, setActiveTab] = useState("post");

  return (
    <>
      {/* global dark mode toggle */}
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

      <div className={`createpost-page-wrapper ${isDark ? "dark" : ""}`}>
        <LeftSidebar />

        <div className="createpost-page">
          <div className="createpost-container">

            <main className="createpost-main">
              <div className="create-post-container">
                <div className="create-post-header">
                  <div className="create-post-title">Create post</div>
                  <div className="drafts-link">Drafts</div>
                </div>

                <div className="create-post-controls">
                  <button className="community-selector">
                    <span className="community-avatar" />
                    <span>Select a community</span>

                    <svg width="18" height="18" viewBox="0 0 18 18" className="dropdown-icon">
                      <path d="M5 7l4 4 4-4" stroke="#878A8C" strokeWidth="2" fill="none" />
                    </svg>
                  </button>
                </div>

                <PostTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                {activeTab === "post" && <FormPostText />}
                {activeTab === "image" && <FormPostImage />}
                {activeTab === "link" && <FormPostLink />}
              </div>
            </main>

            <aside className="createpost-aside" />
          </div>
        </div>
      </div>
    </>
  );
}
