import React from "react";
import "./PostContent.css";

export default function PostContent({ post }) {
  return (
    <div className="post-content">
      {post.title && <div className="post-title">{post.title}</div>}
      {post.text && <div className="post-body">{post.text}</div>}
      {post.image && (
        <div className="post-image">
          <img src={post.image} alt="post visual" />
        </div>
      )}
    </div>
  );
}
