import React from "react";
import PostCard from "../PostCard/PostCard";
import "./TrendingPosts.css";

export default function TrendingPosts({ posts, viewMode, onVote, formatNumber, darkMode }) {
  return (
    <div className="trending-posts">
      {posts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          viewMode={viewMode}
          onVote={onVote}
          formatNumber={formatNumber}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
}