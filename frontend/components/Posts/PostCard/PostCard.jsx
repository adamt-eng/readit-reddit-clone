
import { FaRegCommentAlt, FaShare, FaEllipsisH, FaExpand, FaCompress, FaBell, FaRegBookmark, FaEyeSlash, FaFlag } from "react-icons/fa";
import Comment from "../../Comment/Comment";
import "./PostCard.css";
import { Link,useNavigate } from "react-router-dom";

export default function PostCard({
  // Post data
  post,
  viewMode,
  darkMode,
  
  // Functionality props
  onVote,
  formatNumber,
  onJoinCommunity,
  joinedCommunities = [],
  expandedPostId,
  onCommentInputChange,
  onAddComment,
  onHidePost,
  onCommentVote,
  onCommentReply,
  getThumbnailImage,
  toggleExpand,
  
  // Guest-specific
  isGuest = false,
  onPromptLogin
}) {
  const navigate = useNavigate();
  const isCommentsExpanded = expandedPostId === post.id;

  // Use the provided function or create a default
  const getThumbnail = getThumbnailImage || ((post) => {
    if (post.image) return post.image;
    return darkMode ? "../../../assets/compact-image-dark.png" : "../../../assets/compact-image.png";
  });

const safeJoinedCommunities = Array.isArray(joinedCommunities)
  ? joinedCommunities
  : [];

  const handleUpvote = (e) => {
    e.stopPropagation();
    if (isGuest) {
      onPromptLogin?.();
    } else {
      onVote?.(post.id, 1);  // Just use onVote
    }
  };

  const handleDownvote = (e) => {
    e.stopPropagation();
    if (isGuest) {
      onPromptLogin?.();
    } else {
      onVote?.(post.id, -1);  // Just use onVote
    }
  };

const handleJoinCommunity = (e) => {
  e.stopPropagation();

  if (isGuest) {
    onPromptLogin?.();
    return;
  }

  const communityName =
    typeof post.community === "string"
      ? post.community
      : post.community?.name;

  if (!communityName) {
    console.error("Invalid community:", post.community);
    return;
  }

  onJoinCommunity?.(communityName);
};



  const handleHidePost = (e) => {
    e.stopPropagation();
    if (isGuest) {
      onPromptLogin?.();
    } else {
      onHidePost?.(post.id, e);
    }
  };



  const handleAddComment = () => {
    if (isGuest) {
      onPromptLogin?.();
    } else {
      onAddComment?.(post.id);
    }
  };

  const handleCommentVote = (commentId, voteType) => {
    if (isGuest) {
      onPromptLogin?.();
    } else {
      onCommentVote?.(commentId, voteType);
    }
  };

  const handleCommentReply = (commentId, replyText) => {
    if (isGuest) {
      onPromptLogin?.();
    } else {
      onCommentReply?.(commentId, replyText);
    }
  };

  return (
    <Link to = {`/posts/${post.id}`}>
    <div 
      className={`post-card ${viewMode}-view`}
      onClick={() => onPostClick?.(post.id)}
    >
      {/* Thumbnail for compact view */}
      {viewMode === 'compact' && (
        <div className="post-thumbnail">
          <img 
            src={getThumbnail(post)} 
            alt={post.image ? post.title : "Default post thumbnail"}
            className={`thumbnail-image ${!post.image ? 'default-thumbnail' : ''}`}
          />
        </div>
      )}

      <div className="post-content">
        {/* EXPAND BUTTON for compact view */}
        {viewMode === 'compact' && (post.image || post.content) && (
          <button 
            className="expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand?.(post.id);
            }}
            title={post.isExpanded ? "Collapse" : "Expand"}
          >
            {post.isExpanded ? <FaCompress /> : <FaExpand />}
          </button>
        )}

        <div className="post-meta">
          <Link onClick={(e) => e.stopPropagation()} to={`/community/${post.community}`} className="post-meta-left">
            <img 
              src={post.userAvatar} 
              alt={post.user}
              className="user-avatar"
            />
            {post.community ? (
              <>
                <span className="community">r/{post.community}</span>
                <span className="divider">•</span>
              </>
            ) : (
              <>
                <span className="community">u/{post.user}</span>
                <span className="divider">•</span>
              </>
            )}
            <span className="user">Posted by u/{post.user}</span>
            <span className="divider">•</span>
            <span className="time">{post.time}</span>
          </Link>

          <div className="post-meta-right">
            {/* Join button only shows if post has a community AND is NOT user's own post */}
            {!isGuest&& post.community && !post.isUserPost &&  !safeJoinedCommunities.includes(post.community) && (
              <button
                className={`join-btn joined`}
                onClick={handleJoinCommunity}
              >
                Join
              </button>
            )}

            <div className="post-menu-wrapper" onClick={(e) => e.stopPropagation()}>
              <button className="post-menu-btn">
                <FaEllipsisH />
              </button>

              <div className="post-menu-dropdown">
                {/* Different menu for guests vs logged-in users */}
                {isGuest ? (
                  // Guest menu - only Report button
                  <button className="menu-item flag-item" onClick={onPromptLogin}>
                    <FaFlag className="menu-icon" />
                    Report
                  </button>
                ) : (
                  // Logged-in user menu
                  post.community ? (
                    <>
                      <button className="menu-item">
                        <FaBell className="menu-icon" /> 
                        Follow Post
                      </button>
                      <button className="menu-item">
                        <FaRegBookmark className="menu-icon" /> 
                        Save
                      </button>
                      <button 
                        className="menu-item"
                        onClick={handleHidePost}
                      >
                        <FaEyeSlash className="menu-icon" />
                        Hide
                      </button>
                      <hr className="menu-divider" />
                      <button className="menu-item flag-item">
                        <FaFlag className="menu-icon" />
                        Report
                      </button>
                    </>
                  ) : (
                    /* Minimal menu for user posts (no community) */
                    <>
                      <button 
                        className="menu-item"
                        onClick={handleHidePost}
                      >
                        <FaEyeSlash className="menu-icon" />
                        Hide
                      </button>
                      <button className="menu-item flag-item">
                        <FaFlag className="menu-icon" />
                        Report
                      </button>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <h3 className="post-title">{post.title}</h3>
        
        {/* EXPANDED CONTENT for compact view */}
        {viewMode === 'compact' && post.isExpanded && (
          <div className="expanded-content">
            {post.image && (
              <img 
                src={post.image} 
                alt={post.title}
                className="expanded-image"
              />
            )}
            {post.content && (
              <div className="expanded-text">
                {post.content}
              </div>
            )}
          </div>
        )}
        
        {/* Full content and image for card view */}
        {viewMode === 'card' && (
          <>
            {post.content && (
              <div className="post-body">{post.content}</div>
            )}
            {post.image && (
              <div className="post-image-container">
                <img src={post.image} alt={post.title} className="post-image" />
              </div>
            )}
          </>
        )}

        <div className="post-actions-bar" onClick={(e) => e.stopPropagation()}>
          <div className={`vote-section ${post.userVote === 1 ? 'upvoted' : ''} ${post.userVote === -1 ? 'downvoted' : ''}`}>
            <button 
              onClick={handleUpvote}
              className="vote-btn upvote"
              title="Upvote"
            >
              ⇧
            </button>
            <span className="vote-count">{formatNumber?.(post.voteCount) || post.voteCount}</span>
            <button 
              onClick={handleDownvote}
              className="vote-btn downvote"
              title="Downvote"
            >
              ⇩
            </button>
          </div>
          
          {/* Comment Button */}
          <button 
            className="post-action-btn comment-btn"
          >
            <FaRegCommentAlt className="action-icon" />
            <span className="action-text">{formatNumber?.(post.comments) || post.comments} Comments</span>
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (isGuest) onPromptLogin?.();
            }}
            className="post-action-btn"
          >
            <FaShare className="action-icon" />
            <span className="action-text">Share</span>
          </button>
        </div>
      </div>
    </div>
    </Link>
  );
}