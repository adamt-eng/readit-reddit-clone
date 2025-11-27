// components/TrendingPosts/TrendingPosts.jsx
import React from "react";
import PostCard from "../PostCard/PostCard";
import "./TrendingPosts.css";

export default function TrendingPosts({ 
  posts, 
  viewMode, 
  onVote, 
  formatNumber, 
  darkMode,
  onToggleComments,
  onUpvote,
  onDownvote,
  onHidePost,
  onJoinCommunity,
  expandedPostId,
  joinedCommunities,
  commentInputs,
  onCommentInputChange,
  onAddComment,
  isGuest = false,
  onPromptLogin
}) {
  
  const getThumbnailImage = (post) => {
    if (post.image) {
      return post.image;
    }
    return darkMode ? "/compact-image-dark.png" : "/compact-image.png";
  };

  return (
    <div className="trending-posts">
      <div className={`posts-container ${viewMode}-view`}>
        {posts.map((post) => (
          <PostCard 
            key={post.id}
            post={post}
            viewMode={viewMode}
            onVote={onVote}
            formatNumber={formatNumber}
            darkMode={darkMode}
            onToggleComments={onToggleComments}
            onUpvote={onUpvote}
            onDownvote={onDownvote}
            onHidePost={onHidePost}
            onJoinCommunity={onJoinCommunity}
            expandedPostId={expandedPostId}
            joinedCommunities={joinedCommunities}
            commentInputs={commentInputs}
            onCommentInputChange={onCommentInputChange}
            onAddComment={onAddComment}
            isGuest={isGuest}
            onPromptLogin={onPromptLogin}
            getThumbnailImage={getThumbnailImage}
          />
        ))}
      </div>
    </div>
  );
}