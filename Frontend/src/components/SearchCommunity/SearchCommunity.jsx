 import React from "react";
import "./SearchPost.css";

export default function SearchPost({ post }) {
  return (
    <div className="sr-post">
      <div className="sr-post-left">
        <div className="sr-post-meta">
          <span className="sr-post-community">r/{post.communityName}</span>
          • {post.timeAgo}
        </div>

        <div className="sr-post-title">{post.title}</div>

        <div className="sr-post-sub">
          {post.upvotes} votes • {post.commentsCount} comments
        </div>
      </div>

      {post.thumbnail && (
        <img src={post.thumbnail} alt="" className="sr-post-thumb" />
      )}
    </div>
  );
}
