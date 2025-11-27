// components/PopularCommunities/PopularCommunities.jsx
import React, { useState } from "react";
import "./PopularCommunities.css";

const PopularCommunities = ({ communities, darkMode }) => {
  const [showAll, setShowAll] = useState(false);
  
  // Show only first 3 communities by default, show all when "See More" is clicked
  const displayedCommunities = showAll ? communities : communities.slice(0, 3);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className={`popular-communities ${darkMode ? 'dark-mode' : ''}`}>
      <div className="communities-header">
        <h3>Popular Communities</h3>
      </div>
      <div className="communities-list">
        {displayedCommunities.map((community, index) => (
          <div key={index} className="community-item">
            <div className="community-avatar">
              <img 
                src={community.avatar} 
                alt={community.name}
                className="community-avatar-img"
              />
            </div>
            <div className="community-info">
              <span className="community-name">r/{community.name}</span>
              <span className="community-members">{community.members} members</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* See More Button */}
      {communities.length > 3 && (
        <div className="communities-footer">
          <button 
            className="see-more-btn"
            onClick={toggleShowAll}
          >
            {showAll ? 'See Less' : 'See More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PopularCommunities;