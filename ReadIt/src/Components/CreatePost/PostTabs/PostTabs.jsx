import React from "react";
import "./PostTabs.css";

export default function PostTabs({ activeTab, setActiveTab }) {
  return (
    <div className="tabs">
      <button
        className={activeTab === "post" ? "tab active" : "tab"}
        onClick={() => setActiveTab("post")}
      >
        Post
      </button>

      <button
        className={activeTab === "image" ? "tab active" : "tab"}
        onClick={() => setActiveTab("image")}
      >
        Image
      </button>

      <button
        className={activeTab === "link" ? "tab active" : "tab"}
        onClick={() => setActiveTab("link")}
      >
        Link
      </button>
    </div>
  );
}
