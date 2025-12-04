import "./SearchUser.css";

export default function SearchUser({ user }) {
  return (
    <div className="su-container">
      <img
        className="su-avatar"
        src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user.username}`}
      />

      <div>
        <div className="su-name">{user.displayName}</div>
        <div className="su-handle">@{user.username}</div>
      </div>
    </div>
  );
}
