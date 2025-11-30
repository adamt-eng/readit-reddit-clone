import React from "react";
import "./SearchPost.css";

export default function SearchPost({ post }) {
  return (
    <div className="sp-container">
      <div className="sp-left">
        <div className="sp-meta">r/{post.communityName} • {post.timeAgo}</div>
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
