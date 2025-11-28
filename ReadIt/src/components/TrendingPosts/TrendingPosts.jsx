// components/TrendingPosts/TrendingPosts.jsx
import React from "react";
import PostCard from "../PostCard/PostCard";
import "./TrendingPosts.css";

export default function TrendingPosts({
  // Common props
  posts,
  viewMode,
  darkMode,
  onVote,
  formatNumber,
  onToggleComments,
  onPostClick,
  onJoinCommunity,
  joinedCommunities,
  expandedPostId,
  commentInputs,
  onCommentInputChange,
  onAddComment,
  onHidePost,
  onUnhidePost,
  hiddenPosts = [],
  onUpvote,
  onDownvote,
  onCommentVote,
  onCommentReply,
  getThumbnailImage,
  toggleExpand,
  
  // Guest-specific props
  isGuest = false,
  onPromptLogin
}) {
  
  return (
    <div className="trending-posts">
      {/* Main Posts Container - ONLY this part */}
      <div className={`posts-container ${viewMode}-view`}>
        {posts.map((post) => {
          // Skip rendering if post is hidden
          if (hiddenPosts.includes(post.id)) {
            return (
              <div key={post.id} className="post-hidden-message">
                <span>Post hidden</span>
                <button 
                  className="undo-btn"
                  onClick={(e) => onUnhidePost?.(post.id, e)}
                >
                  Undo
                </button>
              </div>
            );
          }

          return (
            <PostCard
              key={post.id}
              post={post}
              viewMode={viewMode}
              darkMode={darkMode}
              // Pass all functionality props
              onVote={onVote}
              formatNumber={formatNumber}
              onToggleComments={onToggleComments}
              onPostClick={onPostClick}
              onJoinCommunity={onJoinCommunity}
              joinedCommunities={joinedCommunities}
              expandedPostId={expandedPostId}
              commentInputs={commentInputs}
              onCommentInputChange={onCommentInputChange}
              onAddComment={onAddComment}
              onHidePost={onHidePost}
              onUpvote={onUpvote}
              onDownvote={onDownvote}
              onCommentVote={onCommentVote}
              onCommentReply={onCommentReply}
              getThumbnailImage={getThumbnailImage}
              toggleExpand={toggleExpand}
              isGuest={isGuest}
              onPromptLogin={onPromptLogin}
            />
          );
        })}
      </div>
    </div>
  );
}