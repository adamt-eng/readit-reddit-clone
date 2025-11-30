import React from "react";
import "./SearchCommunity.css";

export default function SearchCommunity({ comm }) {
  return (
    <div className="sc-container">
      <div className="sc-title">r/{comm.name}</div>
      <div className="sc-members">
        {comm.membersCount.toLocaleString()} members
      </div>
    </div>
  );
}
