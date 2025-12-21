import { useState } from "react";
import { Link } from "react-router-dom";
import "./Post.css";
import Comment from "../../Comment/Comment.jsx";
import Vote from "../../Vote/Vote.jsx";
import { useEffect } from "react";

export default function Post({
  post,
  comments = [],
  onUpvote,
  onDownvote,
  onComment,
  onVote,
  onEdit,
  onReply,
  isSummaryMode,
  isSummarizing,
  summaryText,
  onGenerateSummary,
  onShowOriginal,
  typingText,
}) 
{
  const [commentText, setCommentText] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title || "");
  const [editText, setEditText] = useState(post.text || "");
  const [removeImage, setRemoveImage] = useState(false);



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

const handleUpvote = () => {
  onUpvote?.();
};

const handleDownvote = () => {
  onDownvote?.();
};

useEffect(() => {
  if (isEditOpen) {
    setEditTitle(post.title || "");
    setEditText(post.text || "");
    setRemoveImage(false);
  }
}, [isEditOpen]);



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
        <Link className="post-author" to={`/user/${post.authorId}`}>
          Posted by u/{post.author}
        </Link>
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
            : isSummaryMode
            ? summaryText
            : post.text}
        </div>

      </div>


      {/* ACTIONS */}
      <div className="post-actions">
        <Vote
          voteCount={post.votes || 0}
          userVote={post.userVote ?? 0}
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
          orientation="horizontal"
          itemId={post.id}
        />

        <button className="action-btn" onClick={handleSharePost}>
          ➤ Share
        </button>
        {post.canEdit && (
          <button
            className="action-btn"
            onClick={() => setIsEditOpen(true)}
          >
            ✎ Edit
          </button>
        )}

        {isSummaryMode ? (
          <>
            <button className="action-btn" onClick={onShowOriginal}>
              📄 Show Original
            </button>

            <button
              className="action-btn"
              onClick={() => onGenerateSummary(true)}
              disabled={isSummarizing}
            >
              {isSummarizing ? "↺ Regenerating..." : "↻ Regenerate"}
            </button>
          </>
        ) : (
          <button
            className="action-btn"
            onClick={() => onGenerateSummary(true)}
            disabled={isSummarizing}
          >
            {isSummarizing ? "↺ Summarizing..." : "✦ Summary"}
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
        {isEditOpen && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Edit Post</h3>

      <input
        className="modal-input"
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        placeholder="Title"
      />

      <textarea
        className="modal-textarea"
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        placeholder="Post description"
      />

      {post.image && !removeImage && (
        <div className="modal-image-preview">
          <img src={post.image} alt="current" />
          <button
            className="danger-btn"
            onClick={() => setRemoveImage(true)}
          >
            Remove image
          </button>
        </div>
      )}

      {removeImage && (
        <div className="image-removed-note">
          Image will be removed
        </div>
      )}

      <div className="modal-actions">
        <button onClick={() => setIsEditOpen(false)}>
          Cancel
        </button>
        <button
          className="primary-btn"
          onClick={() => {
            onEdit?.({
              title: editTitle,
              text: editText,
              removeImage,
            });
            onShowOriginal?.();
            setIsEditOpen(false);
          }}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
