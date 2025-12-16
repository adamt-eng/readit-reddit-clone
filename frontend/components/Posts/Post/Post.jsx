import { useState } from "react";
import "./Post.css";
import Comment from "../../Comment/Comment.jsx";

export default function Post({
  post,
  comments = [],
  onUpvote,
  onDownvote,
  onComment,
  onVote,
  onReply,
  isSummaryMode,
  isSummarizing,
  onGenerateSummary,
  onShowOriginal,
}) {
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment?.(post.id, commentText);
    setCommentText("");
  };

  return (
    <div className="post-card">
      {/* ---------- HEADER ---------- */}
      <div className="post-header">
        <span className="post-community">r/{post.community}</span>
        <span className="dot">•</span>
        <span className="post-author">Posted by u/{post.author}</span>
        <span className="dot">•</span>
        <span className="post-time">{post.timeAgo}</span>
      </div>

      {/* ---------- CONTENT ---------- */}
      <div className="post-content">
        {post.title && <div className="post-title">{post.title}</div>}

        {post.text && <div className="post-body">{post.text}</div>}

        {post.image && (
          <div className="post-image">
            <img src={post.image} alt="post visual" />
          </div>
        )}
      </div>

      {/* ---------- ACTIONS ---------- */}
      <div className="post-actions">
        <button
          className={`vote-btn upvote ${post.userVote === 1 ? "active" : ""}`}
          onClick={onUpvote}
        >
          ▲
        </button>

        <span className="post-votes">{post.votes}</span>

        <button
          className={`vote-btn downvote ${post.userVote === -1 ? "active" : ""}`}
          onClick={onDownvote}
        >
          ▼
        </button>

        {isSummaryMode ? (
          <button className="action-btn" onClick={onShowOriginal}>
            🔄 Show Original
          </button>
        ) : (
          <button
            className="action-btn"
            onClick={onGenerateSummary}
            disabled={isSummarizing}
          >
            {isSummarizing ? "⏳ Summarizing..." : "✨ Summary"}
          </button>
        )}
      </div>

      {/* ---------- COMMENT FORM ---------- */}
      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <textarea
          className="comment-input"
          placeholder="What are your thoughts?"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          type="submit"
          className="comment-submit"
          disabled={!commentText.trim()}
        >
          Comment
        </button>
      </form>

      {/* ---------- COMMENTS ---------- */}
      <div className="comments-list">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            postId={post.id}
            onVote={onVote}
            onReply={onReply}
          />
        ))}
      </div>
    </div>
  );
}
