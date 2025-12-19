import { useState } from "react";
import "./Comment.css";
import Vote from "../Vote/Vote.jsx";

const Comment = ({ comment, depth = 0, onVote, onReply, postId }) => {
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

  const handleShareComment = () => {
  const url = `https://readit-reddit-clone.vercel.app/posts/${postId}#comment-${comment.id}`;
  navigator.clipboard.writeText(url);
  alert("Comment link copied to clipboard");
};


  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <div
      className={`comment ${depth > 0 ? "reply" : ""}`}
      style={{ marginLeft: `${depth * 24}px` }}
    >
      <div className="comment-vote">
        <Vote
        voteCount={comment.upvotes || comment.votes || 0}
        userVote={comment.userVote}
        onUpvote={() => handleVote(1)}
        onDownvote={() => handleVote(-1)}
        orientation="vertical"
        itemId={comment.id}
      />
      </div>

      <div className="comment-body">
        <div className="comment-header">
          {comment.avatar && (
            <img
              src={comment.avatar}
              alt={comment.author}
              className="comment-avatar"
            />
          )}
          <span className="comment-author">u/{comment.author}</span>
          <span className="comment-time">
            • {comment.time || comment.timeAgo}
          </span>
        </div>
        <div className="comment-content">{comment.content || comment.body}</div>
        <div className="comment-actions">
          <button
            className="action-btn"
            onClick={() => setIsReplying(!isReplying)}
          >
            ↩ Reply
          </button>
          <button className="action-btn" onClick={handleShareComment}> Share</button>
          <button className="action-btn">Report</button>

          {/* Show/Hide Replies Button for comments with replies */}
          {comment.replies && comment.replies.length > 0 && (
            <button className="action-btn" onClick={toggleReplies}>
              {showReplies ? "Hide" : "Show"} {comment.replies.length}{" "}
              {comment.replies.length === 1 ? "reply" : "replies"}
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
            {comment.replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                depth={depth + 1}
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
