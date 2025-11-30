import React from "react";
import "./Comments.css";

function Comments({ postId,onClose }) {
  // Fake comments data (replace later with real API)
  
  if (!postId) return null;
  const comments = [
    {
      id: 1,
      author: "u/Cassrole",
      time: "1h ago",
      text: "Great catch! I never noticed Weyland-Yutani beer before.",
      upvotes: 87,
      replies: [
        {
          id: 2,
          author: "u/alienfan69",
          time: "45m ago",
          text: "Same! Also the android blood is milk + some green stuff lol",
          upvotes: 32,
        },
      ],
    },
    {
      id: 3,
      author: "u/MovieDetailsMod",
      time: "2h ago",
      text: "Pro/Costume flair approved. Excellent detail!",
      upvotes: 156,
    },
  ];

  return (
    <div className="commentsSection">
        <div className="commentsHeader">
            <h3>Comments</h3>
            <button onClick={onClose} className="closeBtn" aria-label="Close comments">
                 ×
            </button>
        </div>

      {/* Comment Input */}
      <div className="commentInput">
        <textarea placeholder="What are your thoughts?" rows="4"></textarea>
        <div className="inputActions">
          <button className="commentBtn">Comment</button>
        </div>
      </div>

      {/* Comments List */}
      <div className="commentsList">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="commentVote">
              <button>▲</button>
              <span className="commentUpvotes">{comment.upvotes}</span>
              <button>▼</button>
            </div>

            <div className="commentBody">
              <div className="commentMeta">
                <strong>{comment.author}</strong>
                <span>{comment.time}</span>
              </div>
              <p>{comment.text}</p>

              <div className="commentActions">
                <button>Reply</button>
                <button>Share</button>
                <button>Report</button>
              </div>

              {/* Nested replies */}
              {comment.replies && (
                <div className="replies">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="comment reply">
                      <div className="commentVote">
                        <button>▲</button>
                        <span>{reply.upvotes}</span>
                        <button>▼</button>
                      </div>
                      <div className="commentBody">
                        <div className="commentMeta">
                          <strong>{reply.author}</strong>
                          <span>{reply.time}</span>
                        </div>
                        <p>{reply.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Comments;