import { useState, useEffect } from "react";
import LeftSidebar from "../../LeftSidebar/LeftSidebar";
import PostTabs from "../PostTabs/PostTabs";
import FormPostText from "../FormPostText/FormPostText";
import FormPostImage from "../FormPostImage/FormPostImage";
import FormPostLink from "../FormPostLink/FormPostLink";

import "./CreatePost.css";

export default function CreatePost({ isDark }) {
  const [activeTab, setActiveTab] = useState("post");

  // NEW state
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch communities on mount
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await fetch("http://localhost:5000/posts/communities", {
          credentials: "include"
        });
        const data = await res.json();
        setCommunities(data);
      } catch (err) {
        console.error("Failed to fetch communities", err);
      }
    };

    fetchCommunities();
  }, []);

  return (
    <div className={`createpost-page-wrapper ${isDark ? "dark" : ""}`}>
      {/* Sidebar */}
      <LeftSidebar />

      {/* Main content area */}
      <div className="createpost-page">
        <div className="create-post-wrapper">
          <div className="create-post-container">
            {/* Header */}
            <div className="create-post-header">
              <div className="create-post-title">Create post</div>
              <div className="drafts-link">Drafts</div>
            </div>

            {/* Community selector */}
            <div className="create-post-controls">
              <button
                className="community-selector"
                onClick={() => setShowDropdown(!showDropdown)}
                type="button"
              >
                <span className="community-avatar" />
                <span>
                  {selectedCommunity
                    ? selectedCommunity.name
                    : "Select a community"}
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  className="dropdown-icon"
                >
                  <path
                    d="M5 7l4 4 4-4"
                    stroke="#878A8C"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </button>
            </div>

            {/* Simple dropdown list */}
            {showDropdown && (
              <div style={{ marginBottom: "12px" }}>
                {communities.map((c) => (
                  <div
                    key={c._id}
                    style={{
                      cursor: "pointer",
                      padding: "6px 8px"
                    }}
                    onClick={() => {
                      setSelectedCommunity(c);
                      setShowDropdown(false);
                    }}
                  >
                    {c.name}
                  </div>
                ))}
              </div>
            )}

            {/* Tabs */}
            <PostTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Tab content */}
            {activeTab === "post" && (
              <FormPostText selectedCommunity={selectedCommunity} />
            )}
            {activeTab === "image" && (
              <FormPostImage selectedCommunity={selectedCommunity} />
            )}
            {activeTab === "link" && (
              <FormPostLink selectedCommunity={selectedCommunity} />
            )}
          </div>
        </div>

        <aside className="createpost-aside" />
      </div>
    </div>
  );
}
