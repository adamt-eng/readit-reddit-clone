// src/components/LeftSidebar.jsx
import React from "react";
import "./LeftSidebar.css";

function LeftSidebar({ onOpenCreateCommunity }) {
  return (
    <div className="leftSidebar">
      {/* Logo at the top */}
      <div className="logoContainer">
        <img
          src="/src/assets/reddit-logo.png"
          alt="Reddit"
          className="redditLogo"
        />
      </div>

      {/* Main Navigation */}
      <nav className="mainNav">
        <a href="/" className="navItem active">
          <img src="/src/assets/homeiconn.webp" alt="" className="navIcon" />
          Home
        </a>

        <a href="/" className="navItem">
          <img src="/src/assets/popularicon.png" alt="" className="navIcon" />
          Popular
        </a>

        <a href="/" className="navItem">
          <img src="/src/assets/exploreicon.jpg" alt="" className="navIcon" />
          Explore
        </a>
      </nav>

      {/* Create Community Button */}
      <div className="sidebarCreateCommunity">
        <button
          className="createCommunityBtn"
          onClick={() => {
            console.log("Sidebar button clicked");
            onOpenCreateCommunity && onOpenCreateCommunity();
          }}
        >
          + Create Community
        </button>
      </div>
    </div>
  );
}

export default LeftSidebar;
