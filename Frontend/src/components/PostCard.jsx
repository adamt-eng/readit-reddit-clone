import React, { useState } from "react";
import "./PostCard.css";
import Comments from "./Comments";


function PostCard({ post }) {
  const [showComments, setShowComments] = useState(false);

  if (!post) return null;

  return (
  <div className="postCard">
    {/* MAIN POST ROW: vote bar + content side-by-side */}
    <div className="postMain">
      {/* LEFT VOTE BAR */}
      <div className="voteBar">
        <button className="voteArrow up" aria-label="Upvote">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 8l-6 6h12l-6-6z" />
          </svg>
        </button>
        <div className="voteCount">435</div>
        <button className="voteArrow down" aria-label="Downvote">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 16l6-6H6l6 6z" />
          </svg>
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="postContent">
        <div className="postHeader">
          <span className="subreddit">r/MovieDetails</span>
          <span className="bullet">•</span>
          <span className="author">u/Cassrole</span>
          <span className="time">1hr ago</span>
          <span className="flair gold">Pro/Costume</span>
        </div>

        <h3 className="postTitle">
          <a href="#">{post.title}</a>
        </h3>

        <div className="thumbnailContainer">
          <img src="/src/assets/alienr.jpg" alt="" className="thumbnail" />
        </div>

        <div className="postBody">
          <p>{post.text}</p>
        </div>

        <div className="postFooter">
          <div className="voteSection">
            <button className="voteBtn upvote">
              <svg width="20" height="20"><path fill="currentColor" d="M7 14l5-5 5 5H7z"/></svg>
            </button>
            <span className="karma">435</span>
            <button className="voteBtn downvote">
              <svg width="20" height="20"><path fill="currentColor" d="M7 10l5 5 5-5H7z"/></svg>
            </button>
          </div>

          <button 
            className="actionBtn commentsBtn"
            onClick={() => setShowComments(!showComments)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
            </svg>
            <span>22</span>
          </button>

          <button className="actionBtn shareBtn">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    {/* COMMENTS — NOW BELOW THE ENTIRE POST */}
    {showComments && (
      <div className="commentsWrapper">
        <Comments 
          postId={post.id} 
          onClose={() => setShowComments(false)}
        />
      </div>
    )}
  </div>
);
}

export default PostCard;