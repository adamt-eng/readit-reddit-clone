import React from "react";
import "./CommunitySidebar.css";

function CommunitySidebar({ community }) {
  if (!community) return null;

  return (
    <div className="communitySidebar">
      {/* About Community */}
      <div className="aboutSection">
        <h2>MovieDetails</h2>
        <p className="description">Movie Details, Movie Details</p>
        <div className="stats">
          <div className="stat">
            <strong>561K</strong>
            <span>Members</span>
          </div>
          <div className="stat">
            <strong>87</strong>
            <span>Weekly contributors</span>
          </div>
        </div>
        <p className="created">Created Jun 30, 2017</p>
        <div className="publicInfo">
          <span className="icon">⧉</span>
          <span>Public</span>
        </div>
        <button className="joinBtn">Join</button>
      </div>

      {/* Community Bookmarks */}
      <div className="bookmarksSection">
        <h3>COMMUNITY BOOKMARKS</h3>
        <div className="bookmark">
          <span>The Details Network</span>
          <span className="chevron">▸</span>
        </div>
        <div className="bookmark">
          <span>The Details Network2</span>
          <span className="chevron">▸</span>
        </div>
        <div className="bookmark">
          <span>Chat rooms</span>
          <span className="chevron">▸</span>
        </div>
        <div className="bookmark">
          <span>Twitter</span>
          <span className="chevron">▸</span>
        </div>
      </div>

      {/* Rules */}
      <div className="rulesSection">
        <h3>r/MovieDetails Rules</h3>
        <div className="ruleList">
          <div className="rule">1. No spoilers</div>
          <div className="rule">2. Be respectful</div>
          {/* Add more as needed */}
        </div>
      </div>
    </div>
  );
}

export default CommunitySidebar;