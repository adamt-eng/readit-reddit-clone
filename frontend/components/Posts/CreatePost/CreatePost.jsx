import { useState } from "react";
import LeftSidebar from "../../LeftSidebar/LeftSidebar";
import PostTabs from "../PostTabs/PostTabs";
import FormPostText from "../FormPostText/FormPostText";
import FormPostImage from "../FormPostImage/FormPostImage";
import FormPostLink from "../FormPostLink/FormPostLink";

import "./CreatePost.css";

export default function CreatePost({ isDark }) {
  const [activeTab, setActiveTab] = useState("post");

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
              <button className="community-selector">
                <span className="community-avatar" />
                <span>Select a community</span>
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

            {/* Tabs */}
            <PostTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Tab content */}
            {activeTab === "post" && <FormPostText />}
            {activeTab === "image" && <FormPostImage />}
            {activeTab === "link" && <FormPostLink />}
          </div>
        </div>

        <aside className="createpost-aside" />
      </div>
    </div>
  );
}
