import { useState, useEffect, useRef } from "react";
import LeftSidebar from "../../LeftSidebar/LeftSidebar";
import PostTabs from "../PostTabs/PostTabs";
import CreatePostForm from "../CreatePostForm/CreatePostForm";
import { useSearchParams } from "react-router-dom";

import "./CreatePost.css";

export default function CreatePost({ isDark }) {
  const [activeTab, setActiveTab] = useState("post");

  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  // Read community from URL: /create-post?community=asucommunity
  const [searchParams] = useSearchParams();
  const communityFromUrl = searchParams.get("community");

  // --------------------------------------------------
  // Fetch communities user can post in (AUTH-BASED)
  // --------------------------------------------------
  const fetchCommunities = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/posts/communities",
        { credentials: "include" }
      );

      if (!res.ok) {
        console.error("Failed to load communities");
        setCommunities([]);
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Invalid communities response:", data);
        setCommunities([]);
        return;
      }

      setCommunities(data);

      // Auto-select community if coming from community page
      if (communityFromUrl) {
        const match = data.find(
          (c) => c.name?.toLowerCase() === communityFromUrl.toLowerCase()
        );
        if (match) setSelectedCommunity(match);
      }
    } catch (err) {
      console.error("Failed to fetch communities", err);
      setCommunities([]);
    }
  };

  // Initial load + URL change
  useEffect(() => {
    fetchCommunities();
  }, [communityFromUrl]);



  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () =>
      document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
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
                <span
                  className={`dropdown-arrow ${showDropdown ? "open" : ""}`}
                >
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
            <PostTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* Tab content */}
            <CreatePostForm
            type={activeTab} // "post" | "image" | "link"
  selectedCommunity={selectedCommunity}
/>

          </div>
        </div>

        <aside className="createpost-aside" />
      </div>
    </div>
  );
}
