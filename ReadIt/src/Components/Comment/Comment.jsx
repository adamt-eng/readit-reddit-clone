// components/Comment/Comment.jsx
import React, { useState } from "react";
import { FaArrowUp, FaArrowDown, FaReply } from "react-icons/fa";
import "./Comment.css";

const Comment = ({ comment, depth = 0, darkMode, onVote, onReply, postId }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(true);

  const handleVote = (voteType) => {
    if (onVote) {
      onVote(comment.id, voteType);
    }
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    
    if (onReply) {
      onReply(comment.id, replyText);
      setReplyText("");
      setIsReplying(false);
    }
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <div className={`comment ${depth > 0 ? "reply" : ""}`} style={{ marginLeft: `${depth * 24}px` }}>
      <div className="comment-vote">
        <button 
          onClick={() => handleVote(1)} 
          className={`vote-btn ${comment.userVote === 1 ? "upvoted" : ""}`}
        >
          <FaArrowUp />
        </button>
        <span className={`vote-count ${comment.userVote === 1 ? "upvoted" : comment.userVote === -1 ? "downvoted" : ""}`}>
          {comment.upvotes}
        </span>
        <button 
          onClick={() => handleVote(-1)} 
          className={`vote-btn ${comment.userVote === -1 ? "downvoted" : ""}`}
        >
          <FaArrowDown />
        </button>
      </div>

      <div className="comment-body">
        <div className="comment-header">
          <img src={comment.avatar} alt={comment.author} className="comment-avatar" />
          <span className="comment-author">u/{comment.author}</span>
          <span className="comment-time">• {comment.time}</span>
        </div>
        <div className="comment-content">{comment.content}</div>
        <div className="comment-actions">
          <button 
            className="action-btn" 
            onClick={() => setIsReplying(!isReplying)}
          >
            <FaReply /> Reply
          </button>
          <button className="action-btn">Share</button>
          <button className="action-btn">Report</button>
          
          {/* Show/Hide Replies Button for comments with replies */}
          {comment.replies && comment.replies.length > 0 && (
            <button className="action-btn" onClick={toggleReplies}>
              {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>

        {/* Reply Input */}
        {isReplying && (
          <div className="reply-input-container">
            <textarea
              className="reply-textarea"
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows="3"
            />
            <div className="reply-actions">
              <button 
                className="reply-cancel-btn"
                onClick={() => {
                  setIsReplying(false);
                  setReplyText("");
                }}
              >
                Cancel
              </button>
              <button 
                className="reply-submit-btn"
                onClick={handleReply}
                disabled={!replyText.trim()}
              >
                Reply
              </button>
            </div>
          </div>
        )}

        {/* Render Replies */}
        {comment.replies && comment.replies.length > 0 && showReplies && (
          <div className="comment-replies">
            {comment.replies.map(reply => (
              <Comment 
                key={reply.id} 
                comment={reply} 
                depth={depth + 1} 
                darkMode={darkMode}
                onVote={onVote}
                onReply={onReply}
                postId={postId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;