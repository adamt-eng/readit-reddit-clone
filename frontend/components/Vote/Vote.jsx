/* eslint-disable react-hooks/set-state-in-effect */
import "./Vote.css";
import { useState, useEffect } from "react";

export default function Vote({
  voteCount,
  userVote,
  onUpvote,
  onDownvote,
  orientation = "horizontal",
  itemId,
}) {
  const [currentVote, setCurrentVote] = useState(userVote ?? 0);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with userVote prop
  useEffect(() => {
    setCurrentVote(userVote ?? 0);
  }, [userVote, itemId]);

  const handleUpvote = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await onUpvote?.();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownvote = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await onDownvote?.();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`vote-section ${currentVote === 1 ? "upvoted" : ""} ${currentVote === -1 ? "downvoted" : ""} ${orientation}`}
    >
      <button
        className="vote-btn upvote"
        onClick={handleUpvote}
        title="Upvote"
        disabled={isLoading}
      >
        ▲
      </button>

      <span className="vote-count">{voteCount}</span>

      <button
        className="vote-btn downvote"
        onClick={handleDownvote}
        title="Downvote"
        disabled={isLoading}
      >
        ▼
      </button>
    </div>
  );
}
