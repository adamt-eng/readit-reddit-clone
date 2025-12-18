import {
  FaRegCommentAlt,
  FaShare,
  FaEllipsisH,
  FaExpand,
  FaCompress,
  FaBell,
  FaRegBookmark,
  FaEyeSlash,
  FaFlag,
} from "react-icons/fa";
import "./PostCard.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Vote from "../../Vote/Vote.jsx";

export default function PostCard({
  // Post data
  post,
  viewMode,

  // Functionality props
  onVote,
  formatNumber,
  onJoinCommunity,
  showJoin,
  joinedCommunities = [],
  onHidePost,
  getThumbnailImage,
  toggleExpand,

  // Guest-specific
  isGuest = false,
  onPromptLogin,
}) {
  const [showMenu, setShowMenu] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.post-menu-wrapper')) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Use the provided function or create a default
  const getThumbnail =
    getThumbnailImage ||
    ((post) => {
      if (post.image) return `${import.meta.env.VITE_API_URL}${post.image}`;
      return "../../../assets/compact-image.png";
    });

  const handleUpvote = () => {
    if (isGuest) {
      onPromptLogin?.();
    } else {
      onVote?.(post.id, 1);
    }
  };

  const handleDownvote = () => {
    if (isGuest) {
      onPromptLogin?.();
    } else {
      onVote?.(post.id, -1);
    }
  };

  const handleJoinCommunity = (e) => {
    e.stopPropagation();
    e.preventDefault();

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
  
  const handleSharePost = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `https://readit-reddit-clone.vercel.app/posts/${post.id}`;
    navigator.clipboard.writeText(url);
    alert("Post link copied to clipboard");
  };

  const handleHidePost = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    
    if (isGuest) {
      onPromptLogin?.();
    } else {
      onHidePost?.(post.id, e);
    }
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleMenuAction = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(false);
    
    if (action === 'hide') {
      handleHidePost(e);
    } else if (action === 'report') {
      console.log('Report post:', post.id);
      // Add report logic here
    } else if (action === 'save') {
      console.log('Save post:', post.id);
      // Add save logic here
    } else if (action === 'follow') {
      console.log('Follow post:', post.id);
      // Add follow logic here
    }
  };

  return (
    <div className={`post-card ${viewMode}-view`}>
      {/* Thumbnail for compact view - only show when NOT expanded AND has image */}
      {viewMode === "compact" && !post.isExpanded && post.image && (
        <Link to={`/posts/${post.id}`} className="post-thumbnail">
          <img
            src={getThumbnail(post)}
            alt={post.title}
            className="thumbnail-image"
          />
        </Link>
      )}

      {/* When expanded in compact view, add a class for spacing - only if has image */}
      {viewMode === "compact" && post.isExpanded && post.image && (
        <div className="post-thumbnail-placeholder"></div>
      )}

      <div className="post-content">
        {/* EXPAND BUTTON for compact view - NOT wrapped in Link */}
        {viewMode === "compact" && (post.image || post.content) && (
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
          <Link
            onClick={(e) => e.stopPropagation()}
            to={`/community/${post.community}`}
            className="post-meta-left"
          >
            <img
              src={
                post.communityIcon
                  ? `${import.meta.env.VITE_API_URL}${post.communityIcon}`
                  : `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(post.community)}`
              }
              alt={`r/${post.community}`}
              className="community-icon"
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
            {!isGuest &&
              post.community &&
              !post.isUserPost &&
              (Array.isArray(joinedCommunities)
                ? !joinedCommunities.includes(post.community)
                : true) && showJoin && (
                <button
                  className={`join-btn joined`}
                  onClick={handleJoinCommunity}
                >
                  Join
                </button>
              )}

            <div
              className="post-menu-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="post-menu-btn"
                onClick={toggleMenu}
              >
                <FaEllipsisH />
              </button>

              {showMenu && (
                <div 
                  className="post-menu-dropdown"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Different menu for guests vs logged-in users */}
                  {isGuest ? (
                    // Guest menu - only Report button
                    <button
                      className="menu-item flag-item"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowMenu(false);
                        onPromptLogin?.();
                      }}
                    >
                      <FaFlag className="menu-icon" />
                      Report
                    </button>
                  ) : post.community ? (
                    <>
                      <button 
                        className="menu-item"
                        onClick={(e) => handleMenuAction(e, 'follow')}
                      >
                        <FaBell className="menu-icon" />
                        Follow Post
                      </button>
                      <button 
                        className="menu-item"
                        onClick={(e) => handleMenuAction(e, 'save')}
                      >
                        <FaRegBookmark className="menu-icon" />
                        Save
                      </button>
                      <button 
                        className="menu-item" 
                        onClick={(e) => handleMenuAction(e, 'hide')}
                      >
                        <FaEyeSlash className="menu-icon" />
                        Hide
                      </button>
                      <hr className="menu-divider" />
                      <button 
                        className="menu-item flag-item"
                        onClick={(e) => handleMenuAction(e, 'report')}
                      >
                        <FaFlag className="menu-icon" />
                        Report
                      </button>
                    </>
                  ) : (
                    /* Minimal menu for user posts (no community) */
                    <>
                      <button 
                        className="menu-item" 
                        onClick={(e) => handleMenuAction(e, 'hide')}
                      >
                        <FaEyeSlash className="menu-icon" />
                        Hide
                      </button>
                      <button 
                        className="menu-item flag-item"
                        onClick={(e) => handleMenuAction(e, 'report')}
                      >
                        <FaFlag className="menu-icon" />
                        Report
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title wrapped in Link */}
        <Link to={`/posts/${post.id}`} style={{ textDecoration: 'none' }}>
          <h3 className="post-title">{post.title}</h3>
        </Link>

        {/* EXPANDED CONTENT for compact view */}
        {viewMode === "compact" && post.isExpanded && (
          <div className="expanded-content">
            {post.image && (
              <img
                src={`${import.meta.env.VITE_API_URL}${post.image}`}
                alt={post.title}
                className="expanded-image"
              />
            )}
            {post.content && (
              <div className="expanded-text">{post.content}</div>
            )}
          </div>
        )}

        {/* Full content and image for card view */}
        {viewMode === "card" && !post.isExpanded && (
          <Link to={`/posts/${post.id}`} style={{ textDecoration: 'none' }}>
            {post.content && <div className="post-body">{post.content}</div>}
            {post.image && (
              <div className="post-image-container">
                <img
                  src={`${import.meta.env.VITE_API_URL}${post.image}`}
                  alt={post.title}
                  className="post-image"
                />
              </div>
            )}
          </Link>
        )}

        <div
          className="post-actions-bar"
          onClick={(e) => e.stopPropagation()}
        >
          <Vote
            voteCount={formatNumber?.(post.voteCount) || post.voteCount}
            userVote={post.userVote}
            onUpvote={handleUpvote}
            onDownvote={handleDownvote}
            orientation="horizontal"
            itemId={post.id}
            itemType="post"
          />

          {/* Comment Button - wrapped in Link */}
          <Link to={`/posts/${post.id}`} style={{ textDecoration: 'none' }}>
            <button className="post-action-btn comment-btn">
              <FaRegCommentAlt className="action-icon" />
              <span className="action-text">
                {formatNumber?.(post.comments) || post.comments} Comments
              </span>
            </button>
          </Link>

          <button
            onClick={(e) => {
              if (isGuest) {
                e.stopPropagation();
                onPromptLogin?.();
              } else {
                handleSharePost(e);
              }
            }}
            className="post-action-btn"
          >
            <FaShare className="action-icon" />
            <span className="action-text">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}