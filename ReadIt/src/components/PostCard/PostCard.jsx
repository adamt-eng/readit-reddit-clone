// components/PostCard/PostCard.jsx
import React, { useState } from "react";
import { FaRegCommentAlt, FaShare, FaBookmark, FaEllipsisH, FaExpand, FaCompress } from "react-icons/fa";
import "./PostCard.css";

export default function PostCard({ post, viewMode, onVote, formatNumber, darkMode }) {
  const promptLogin = () => alert("Login to continue");
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleUpvote = () => {
    onVote(post.id, 1);
  };

  const handleDownvote = () => {
    onVote(post.id, -1);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getVoteButtonClass = (buttonType) => {
    const baseClass = "vote-btn";
    if (buttonType === 'up' && post.userVote === 1) return `${baseClass} upvote active`;
    if (buttonType === 'down' && post.userVote === -1) return `${baseClass} downvote active`;
    return `${baseClass} ${buttonType}vote`;
  };

  // Function to get the appropriate thumbnail image
  const getThumbnailImage = () => {
    if (post.image) {
      return post.image;
    }
    return darkMode ? "/compact-image-dark.png" : "/compact-image.png";
  };

  // Function to get alt text for the thumbnail
  const getThumbnailAlt = () => {
    if (post.image) {
      return post.title;
    }
    return "Default post thumbnail";
  };

  // Check if post has content to expand (image or text content)
  const hasExpandableContent = post.image || post.content;

  return (
    <div className={`post-card ${viewMode}-view`}>
      {/* Thumbnail for compact view - always show, with default image if needed */}
      {viewMode === 'compact' && (
        <div className="post-thumbnail">
          <img 
            src={getThumbnailImage()} 
            alt={getThumbnailAlt()}
            className={`thumbnail-image ${!post.image ? 'default-thumbnail' : ''}`}
            onClick={promptLogin}
          />
        </div>
      )}

      <div className="post-content">
        {/* Expand button for compact view */}
        {viewMode === 'compact' && hasExpandableContent && (
          <button 
            className="expand-btn"
            onClick={toggleExpand}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <FaCompress /> : <FaExpand />}
          </button>
        )}

        <div className="post-meta">
          <span className="community">r/{post.community}</span>
          <span className="divider">•</span>
          <span className="user">Posted by u/{post.user}</span>
          <span className="divider">•</span>
          <span className="time">{post.time}</span>
        </div>

        <h3 className="post-title">{post.title}</h3>
        
        {/* Expanded content in compact view */}
        {viewMode === 'compact' && isExpanded && (
          <div className="expanded-content">
            {post.image && (
              <img 
                src={post.image} 
                alt={post.title}
                className="expanded-image"
                onClick={promptLogin}
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
              <div className="post-body">
                {post.content}
              </div>
            )}
            {post.image && (
              <div className="post-image-container">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="post-image"
                  onClick={promptLogin}
                />
              </div>
            )}
          </>
        )}

        <div className="post-actions-bar">
          <div className={`vote-section ${post.userVote === 1 ? 'upvoted' : ''} ${post.userVote === -1 ? 'downvoted' : ''}`}>
            <button 
              onClick={handleUpvote} 
              className="vote-btn upvote"
              title="Upvote"
            >
              ⇧
            </button>
            <span className="vote-count">{formatNumber(post.upvotes)}</span>
            <button 
              onClick={handleDownvote} 
              className="vote-btn downvote"
              title="Downvote"
            >
              ⇩
            </button>
          </div>
          
          <button onClick={promptLogin} className="post-action-btn comment-btn">
            <FaRegCommentAlt className="action-icon" />
            <span className="action-text">{formatNumber(post.comments)} Comments</span>
          </button>
          
          <button onClick={promptLogin} className="post-action-btn">
            <FaShare className="action-icon" />
            <span className="action-text">Share</span>
          </button>
          
          <button onClick={promptLogin} className="post-action-btn">
            <FaBookmark className="action-icon" />
            <span className="action-text">Save</span>
          </button>
          
        </div>
      </div>
    </div>
  );
}