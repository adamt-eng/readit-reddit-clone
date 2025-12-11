import { useState, useEffect, useRef } from "react";
import LeftSidebar from "../../LeftSidebar/LeftSidebar";
import PostTabs from "../PostTabs/PostTabs";
import FormPostText from "../FormPostText/FormPostText";
import FormPostImage from "../FormPostImage/FormPostImage";
import FormPostLink from "../FormPostLink/FormPostLink";

import "./CreatePost.css";

export default function CreatePost({ isDark }) {
  const [activeTab, setActiveTab] = useState("post");

  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  // TEMP USER
  const TEMP_USER_ID = "6938a02cea96c570c169d837";

  // Fetch communities
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/posts/communities?userId=${TEMP_USER_ID}`
        );
        const data = await res.json();
        setCommunities(data);
      } catch (err) {
        console.error("Failed to fetch communities", err);
      }
    };

    fetchCommunities();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className={`createpost-page-wrapper ${isDark ? "dark" : ""}`}>
      <LeftSidebar />

      <div className="createpost-page">
        <div className="create-post-wrapper">
          <div className="create-post-container">

            {/* Header */}
            <div className="create-post-header">
              <div className="create-post-title">Create post</div>
              <div className="drafts-link">Drafts</div>
            </div>

            {/* Community Selector */}
            <div className="create-post-controls" ref={dropdownRef}>
              <button
                className="community-selector"
                type="button"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <span className="community-avatar" />
                <span className="community-selector-text">
                  {selectedCommunity
                    ? selectedCommunity.name
                    : "Select a community"}
                </span>
                <span className={`dropdown-arrow ${showDropdown ? "open" : ""}`}>
                  ▾
                </span>
              </button>

              {showDropdown && (
                <div className="community-dropdown">
                  {communities.length === 0 && (
                    <div className="community-empty">
                      No communities available
                    </div>
                  )}

                  {communities.map((c) => {
                    const isSelected = selectedCommunity?._id === c._id;

                    return (
                      <div
                        key={c._id}
                        className={`community-option ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() => {
                          setSelectedCommunity(c);
                          setShowDropdown(false);
                        }}
                      >
                        <span className="community-avatar small" />
                        <div className="community-text">
                          <div className="community-name">{c.name}</div>
                          {c.title && (
                            <div className="community-title">{c.title}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tabs */}
            <PostTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Tab content */}
            {activeTab === "post" && (
              <FormPostText
                selectedCommunity={selectedCommunity}
                userId={TEMP_USER_ID}
              />
            )}

            {activeTab === "image" && (
              <FormPostImage
                selectedCommunity={selectedCommunity}
                userId={TEMP_USER_ID}
              />
            )}

            {activeTab === "link" && (
              <FormPostLink
                selectedCommunity={selectedCommunity}
                userId={TEMP_USER_ID}
              />
            )}

          </div>
        </div>

        <aside className="createpost-aside" />
      </div>
    </div>
  );
}
