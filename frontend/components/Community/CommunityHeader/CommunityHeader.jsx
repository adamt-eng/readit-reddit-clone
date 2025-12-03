import React from "react";
import "./CommunityHeader.css";



function CommunityHeader({ community }) {
  if (!community) return null;

  return (
    <div className="communityHeader">
      {/* Banner - Maroon like screenshot */}
      <div className="bannerContainer">
      <img 
        src="/src/assets/moviebanner.jpg" 
        alt="banner" 
        className="banner" 
      />
      </div>

      {/* Info bar - Icon overlaps banner, title aligned right */}
      <div className="info">
       <img 
         src="/src/assets/movieicon.webp" 
          alt="icon" 
          className="communityIcon" 
        />

        <div className="textInfo">
          <h1 className="name">r/{community.name}</h1>
          <p className="description">Movie Details, Movie Details</p>
        </div>

        <div className="buttonGroup">
          <button className="createPostBtn">+ Create Post</button>
          <button className="joinBtn">Join</button>
        </div>
      </div>
    </div>
  );
}

export default CommunityHeader;