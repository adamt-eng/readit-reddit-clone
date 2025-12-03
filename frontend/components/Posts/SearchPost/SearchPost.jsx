import React from "react";
import "./SearchPost.css";

export default function SearchPost({ post }) {
  return (
    <div className="sp-container">
      <div className="sp-left">
        <div className="info">
        <img 
        src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(post.communityName)}`} 
        alt="community icon" 
        className="sp-icon"
      />
        <div className="sp-meta">r/{post.communityName} • {post.timeAgo}</div></div>
        <div className="sp-title">{post.title}</div>
        <div className="sp-sub">
          {post.upvotes.toLocaleString()} votes •{" "}
          {post.commentsCount.toLocaleString()} comments
        </div>
      </div>

      {post.thumbnail && (
        <img className="sp-thumb" src={post.thumbnail} alt="" />
      )}
    </div>
  );
}
