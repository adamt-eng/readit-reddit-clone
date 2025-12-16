import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { FaTrash } from "react-icons/fa";

import axios from "axios";
import "./SearchItem.css";

function formatTimeAgo(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

export default function SearchItem({ type, data, member = false,onLeave = null, onDelete = null}) {
  const[isMember,setIsMember] = useState(member);

  // COMMUNITY RESULT
  if (type === "community") {
    const handleMembership = async (e) => {
      e.preventDefault(); 
      e.stopPropagation();
      try{
      if (isMember) {
        await axios.post(`http://localhost:5000/communities/${data.name}/leave`,{},{withCredentials:true}); 
        setIsMember(false);
        if(onLeave)
          onLeave(data.name);
      } else {
        await axios.post(`http://localhost:5000/communities/${data.name}/join`,{},{withCredentials:true}); 
                setIsMember(true);

      }
    }
    catch(err){
      console.log("Failed to join/leave community ",err);
    }
    };

    return (
      <Link to={`/community/${data.name}`} className="sc-container">
        <img
          src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(data.name)}`}
          alt="community icon"
          className="sc-icon"
        />

        <div className="sc-info">
          <div className="sc-title">
            {data.name.startsWith("r/") ? data.name : "r/" + data.name}
          </div>
          <div className="sc-members">
            {(data.memberCount ?? 0).toLocaleString()} members
          </div>
        </div>

        {/* JOIN / LEAVE BUTTON */}
        <button
          className={`sc-join-btn ${isMember ? "leave" : "join"}`}
          onClick={handleMembership}
        >
          {isMember ? "Leave" : "Join"}
        </button>
      </Link>
    );
  }

// post
if (type === "post") {
  const timeAgo = formatTimeAgo(data.createdAt);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await axios.delete(
        `http://localhost:5000/posts/${data._id}`,
        { withCredentials: true }
      );

      if (onDelete) {
        onDelete(data._id);
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  return (
    <Link to={`/posts/${data._id}`} className="sp-container">
      <div className="sp-left">
        <div className="sp-meta">
          <img
            src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(data.communityName)}`}
            alt="community icon"
            className="sp-icon"
          />
          <span className="sp-community">
            {data.communityName.startsWith("r/")
              ? data.communityName
              : "r/" + data.communityName}
          </span>
          <span className="sp-time">• {timeAgo}</span>
        </div>

        <div className="sp-title">{data.title}</div>

        <div className="sp-sub">
          {(data.upvoteCount ?? 0).toLocaleString()} votes •{" "}
          {(data.commentCount ?? 0).toLocaleString()} comments
        </div>
      </div>

      {onDelete && (
        <FaTrash
          className="sp-delete-btn"
          onClick={handleDelete}
        >
          Delete
        </FaTrash>
      )}

      {data.media?.url && (
        <img className="sp-thumb" src={data.media.url} alt="" />
      )}
    </Link>
  );
}


  // user
  if (type === "user") {
    return (
      <Link to={`/user/${data._id}`} className="su-container">
        <img
          className="su-avatar"
          src={
            data.avatarUrl ||
            `https://api.dicebear.com/7.x/thumbs/svg?seed=${data.username}`
          }
          alt="avatar"
        />

        <div>
          <div className="su-name">u/{data.username}</div>
          <div className="su-handle">@{data.username}</div>
        </div>
      </Link>
    );
  }

  return null;
}
