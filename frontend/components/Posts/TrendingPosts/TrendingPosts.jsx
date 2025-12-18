import PostCard from "../PostCard/PostCard.jsx";
import "./TrendingPosts.css";

export default function TrendingPosts({
  // Common props
  posts,
  viewMode,
  onVote,
  formatNumber,
  onJoinCommunity,
  joinedCommunities,
  expandedPostId,
  onHidePost,
  onUnhidePost,
  hiddenPosts = [],
  getThumbnailImage,
  toggleExpand,

  // Guest-specific props
  isGuest = false,
  onPromptLogin,
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
              // Pass all functionality props
              onVote={onVote}
              formatNumber={formatNumber}
              onJoinCommunity={onJoinCommunity}
              joinedCommunities={joinedCommunities}
              expandedPostId={expandedPostId}
              onHidePost={onHidePost}
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
