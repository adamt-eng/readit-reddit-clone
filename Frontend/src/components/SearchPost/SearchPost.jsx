import React from "react";
import "./SearchCommunity.css";

export default function SearchCommunity({ comm }) {
  return (
    <div className="sr-community-item">
      <div>
        <div className="sr-community-title">r/{comm.name}</div>
        <div className="sr-community-members">
          {comm.membersCount.toLocaleString()} members
        </div>
      </div>
    </div>
  );
}
