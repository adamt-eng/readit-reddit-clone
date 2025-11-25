import React from "react";
import "./PopularCommunities.css";

export default function PopularCommunities({ communities, darkMode }) {
  const promptLogin = () => alert("Login to continue");

  return (
    <div className="community-box">
      <div className="community-header">
        <h3>POPULAR COMMUNITIES</h3>
      </div>
      
      <div className="community-list">
        {communities.map((com, i) => (
          <div className="community-item" key={i}>
            <div className="community-icon">🌟</div>
            
            <div className="community-info">
              <span className="community-name">r/{com.name}</span>
              <small className="community-members">{com.members} members</small>
            </div>
          </div>
        ))}
      </div>
      
      <div className="community-footer">
        <button onClick={promptLogin} className="see-more-btn">
          See more
        </button>
      </div>
    </div>
  );
}