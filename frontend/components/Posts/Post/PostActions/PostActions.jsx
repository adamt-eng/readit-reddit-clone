import "./PostActions.css";

export default function PostActions({
  post,
  onUpvote,
  onDownvote,
  isSummaryMode,
  isSummarizing,
  onGenerateSummary,
  onShowOriginal
}) {
  return (
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
  );
}
