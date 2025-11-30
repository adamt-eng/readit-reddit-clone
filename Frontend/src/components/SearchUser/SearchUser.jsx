import React from "react";
import "./SearchUser.css";

export default function SearchUser({ user }) {
  return (
    <div className="sr-user">
      <img
        className="sr-user-avatar"
        src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user.username}`}
        alt=""
      />

      <div>
        <div className="sr-user-name">{user.displayName}</div>
        <div className="sr-user-handle">@{user.username}</div>
      </div>
    </div>
  );
}
