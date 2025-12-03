import React from "react";
import "./SearchCommunity.css";
export default function SearchCommunity({ comm }) {
  return (
    <div className="sc-container">
      <img 
        src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(comm.name)}`} 
        alt="community icon" 
        className="sc-icon"
      />

      <div className="sc-info">
        <div className="sc-title">r/{comm.name}</div>
        <div className="sc-members">
          {comm.membersCount.toLocaleString()} members
        </div>
      </div>
    </div>
  );
}
