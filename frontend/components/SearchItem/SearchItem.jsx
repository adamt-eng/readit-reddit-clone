import "./SearchItem.css";

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
            {data.membersCount.toLocaleString()} members
          </div>
        </div>
      </div>
    );
  }

  // ---------- POST ----------
  if (type === "post") {
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
              r/{data.communityName} • {data.timeAgo}
            </div>
          </div>

          <div className="sp-title">{data.title}</div>

          <div className="sp-sub">
            {data.upvotes.toLocaleString()} votes •{" "}
            {data.commentsCount.toLocaleString()} comments
          </div>
        </div>

        {data.thumbnail && (
          <img className="sp-thumb" src={data.thumbnail} alt="" />
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
          src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${data.username}`}
          alt="avatar"
        />

        <div>
          <div className="su-name">{data.displayName}</div>
          <div className="su-handle">@{data.username}</div>
        </div>
      </div>
    );
  }

  // ---------- FALLBACK ----------
  return null;
}
