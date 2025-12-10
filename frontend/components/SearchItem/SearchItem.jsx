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

export default function SearchItem({ type, data }) {

  // ---------- COMMUNITY ----------
  if (type === "community") {
    return (
      <div className="sc-container">
        <img
          src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(data.name)}`}
          alt="community icon"
          className="sc-icon"
        />

        <div className="sc-info">
          <div className="sc-title">r/{data.name}</div>
          <div className="sc-members">
            {(data.memberCount ?? 0).toLocaleString()} members
          </div>
        </div>
      </div>
    );
  }

  // ---------- POST ----------
  if (type === "post") {
    const timeAgo = formatTimeAgo(data.createdAt);

    return (
      <div className="sp-container">
        <div className="sp-left">
          <div className="info">
            <img
              src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(data.communityName)}`}
              alt="community icon"
              className="sp-icon"
            />
            <div className="sp-meta">
              r/{data.communityName} • {timeAgo}
            </div>
          </div>

          <div className="sp-title">{data.title}</div>

          <div className="sp-sub">
            {(data.upvoteCount ?? 0).toLocaleString()} votes •{" "}
            {(data.commentCount ?? 0).toLocaleString()} comments
          </div>
        </div>

        {data.media?.url && (
          <img className="sp-thumb" src={data.media.url} alt="" />
        )}
      </div>
    );
  }

  // ---------- USER ----------
  if (type === "user") {
    return (
      <div className="su-container">
        <img
          className="su-avatar"
          src={data.avatarUrl || `https://api.dicebear.com/7.x/thumbs/svg?seed=${data.username}`}
          alt="avatar"
        />

        <div>
          <div className="su-name">u/{data.username}</div>
          <div className="su-handle">@{data.username}</div>
        </div>
      </div>
    );
  }

  return null;
}
