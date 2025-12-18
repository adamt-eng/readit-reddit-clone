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
  itemType = "post",
}) {
  const [currentVote, setCurrentVote] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch vote state from backend on mount to persist across page refreshes
  useEffect(() => {
    const fetchVoteState = async () => {
      if (!itemId) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/votes/me`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const voteData = await response.json();
          
          if (itemType === "post" && voteData.posts && voteData.posts[itemId] !== undefined) {
            setCurrentVote(voteData.posts[itemId]);
          } else if (itemType === "comment" && voteData.comments && voteData.comments[itemId] !== undefined) {
            setCurrentVote(voteData.comments[itemId]);
          } else {
            setCurrentVote(0);
          }
        }
      } catch (error) {
        console.error("Failed to fetch vote state:", error);
      }
    };

    fetchVoteState();
  }, [itemId, itemType]);

  // Sync with userVote prop when it changes (after parent saves vote to DB)
  useEffect(() => {
    setCurrentVote(userVote || 0);
  }, [userVote]);

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
      <button className="vote-btn upvote" onClick={handleUpvote} title="Upvote" disabled={isLoading}>
        ▲
      </button>

      <span className="vote-count">
        {voteCount}
      </span>

      <button className="vote-btn downvote" onClick={handleDownvote} title="Downvote" disabled={isLoading}>
        ▼
      </button>
    </div>
  );
}
