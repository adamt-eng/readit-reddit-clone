import { FaArrowUp, FaRegCommentAlt } from "react-icons/fa";

const RecentPosts = ({ 
  recentPosts, 
  darkMode, 
  onClearRecentPosts, 
  onPostClick, 
  onCommunityClick,
  formatRelativeTime,
  formatNumber,
  getRecentPostThumbnail 
}) => {
  // Function to get thumbnail for recent posts
  const getThumbnail = (post) => {
    if (post.image) {
      return post.image;
    }
    return darkMode ? "../../../assets/compact-image-dark.png" : "../../../assets/compact-image.png";
  };

  if (!recentPosts || recentPosts.length === 0) {
    return null;
  }

  return (
    <div className="recent-posts-box">
      <div className="recent-posts-header">
        <h3>RECENT POSTS</h3>
        <button 
          className="clear-recent-btn"
          onClick={onClearRecentPosts}
          title="Clear all recent posts"
        >
          Clear
        </button>
      </div>
      
      <div className="recent-posts-list">
        {recentPosts.map((post) => (
          <div 
            key={post.id} 
            className="recent-post-item"
            onClick={() => onPostClick && onPostClick(post.id)}
          >
            <div className="recent-post-thumbnail">
              {post.image ? (
                <img 
                  src={getRecentPostThumbnail ? getRecentPostThumbnail(post) : getThumbnail(post)} 
                  alt={post.title}
                />
              ) : (
                <div className="default-thumbnail">
                  📝
                </div>
              )}
            </div>
            
            <div className="recent-post-content">
              <div className="recent-post-header">
                <img 
                  src={post.userAvatar} 
                  alt={post.user}
                  className="recent-post-user-avatar"
                />
                <span 
                  className="recent-post-community"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (post.community && onCommunityClick) {
                      onCommunityClick(post.community);
                    } else {
                      console.log(`Opening user profile for ${post.user}`);
                    }
                  }}
                >
                  {post.community ? `r/${post.community}` : `u/${post.user}`}
                </span>
                <span className="recent-post-divider">•</span>
                <span className="recent-post-time">
                  {formatRelativeTime ? formatRelativeTime(post.time) : post.time}
                </span>
              </div>
              
              <div className="recent-post-title">
                {post.title}
              </div>
              <div className="recent-post-stats">
                <div className="recent-post-stat">
                  <FaArrowUp className="icon" />
                  <span>{formatNumber ? formatNumber(post.upvotes) : post.upvotes}</span>
                </div>
                <div className="recent-post-stat">
                  <FaRegCommentAlt className="icon" />
                  <span>{formatNumber ? formatNumber(post.comments) : post.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPosts;