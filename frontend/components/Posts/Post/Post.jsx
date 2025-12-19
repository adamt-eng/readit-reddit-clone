import { useState } from "react";
import "./Post.css";
import Comment from "../../Comment/Comment.jsx";
import Vote from "../../Vote/Vote.jsx";

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
  typingText,
}) 
{
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment?.(post.id, commentText);
    setCommentText("");
  };

  const handleSharePost = () => {
  const url = `https://readit-reddit-clone.vercel.app/posts/${post.id}`;
  navigator.clipboard.writeText(url);
  alert("Post link copied to clipboard");
};


  return (
    <div className="post-card">
      {/* HEADER */}
      <div className="post-header">
        <img 
          className="post-community-avatar"
          src={
            post.communityIcon
              ? `${import.meta.env.VITE_API_URL}${post.communityIcon}`
              : `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(post.community)}`
            }
            alt={`r/${post.community}`}
        />
        <span className="post-community">r/{post.community}</span>
        <span className="dot">•</span>
        <span className="post-author">Posted by u/{post.author}</span>
        <span className="dot">•</span>
        <span className="post-time">{post.timeAgo}</span>
      </div>

      {/* CONTENT */}
      <div className="post-content">
        {post.title && <div className="post-title">{post.title}</div>}

        {post.image && (
          <div className="post-image">
            <img src={post.image} alt="post visual" />
          </div>
        )}

        <div className="post-body">
          {isSummarizing && typingText
            ? typingText
            : post.text}
        </div>

      </div>


      {/* ACTIONS */}
      <div className="post-actions">
        <Vote
          voteCount={post.votes}
          userVote={post.userVote}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
          orientation="horizontal"
          itemId={post.id}
        />

        <button className="action-btn" onClick={handleSharePost}>
          🔗 Share
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

      {/* COMMENT FORM */}
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

      {/*COMMENTS */}
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              postId={post.id}
              onVote={onVote}
              onReply={onReply}
            />
          ))
        ) : (
          <div className="no-comments">
            Be the first to comment on this post!
          </div>
        )}
      </div>
    </div>
  );
}
