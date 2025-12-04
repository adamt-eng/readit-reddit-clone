import "./PostActions.css";

export default function PostActions({ post, onUpvote, onDownvote }) {
  return (
    <div className="post-actions">
      <button className="vote-btn upvote" onClick={() => onUpvote?.(post.id)} title="Upvote">▲</button>
      <span className="post-votes">{post.votes}</span>
      <button className="vote-btn downvote" onClick={() => onDownvote?.(post.id)} title="Downvote">▼</button>
      <button className="action-btn">💬 {post.commentsCount} Comments</button>
      <button className="action-btn">🔗 Share</button>
      <button className="action-btn">💡 Save</button>
    </div>
  );
}
