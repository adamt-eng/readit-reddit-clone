import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CommunityHeader.css";

function CommunityHeader({ community, isMember, setIsMember }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!community) return null;

  const baseUrl = import.meta.env.VITE_API_URL;

  const shownBanner = community?.bannerUrl
    ? `${baseUrl}${community.bannerUrl}`
    : ""; // or a default banner

  const shownIcon = community?.iconUrl ? `${baseUrl}${community.iconUrl}` : ""; // or a default icon

  const handleCreatePost = () => {
    navigate(`/create-post?community=${encodeURIComponent(community.name)}`);
  };

  const handleJoinToggle = async () => {
    try {
      setLoading(true);

      const url = isMember
        ? `${baseUrl}/communities/${encodeURIComponent(community.name)}/leave`
        : `${baseUrl}/communities/${encodeURIComponent(community.name)}/join`;

      const method = isMember ? "DELETE" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Action failed");
        return;
      }

      setIsMember(!isMember);
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="communityHeader">
      <div className="bannerContainer">
        {shownBanner ? (
          <img src={shownBanner} alt="banner" className="banner" />
        ) : (
          <div className="banner bannerPlaceholder" />
        )}
      </div>

      <div className="info">
        {shownIcon ? (
          <img src={shownIcon} alt="icon" className="communityIcon" />
        ) : (
          <div className="communityIcon iconPlaceholder">r/</div>
        )}

        <div className="textInfo">
          <h1 className="name">r/{community.name}</h1>
          <p className="description">{community.description || ""}</p>
        </div>

        <div className="buttonGroup">
          <button className="createPostBtn" onClick={handleCreatePost}>
            + Create Post
          </button>

          <button
            className="joinBtn"
            onClick={handleJoinToggle}
            disabled={loading}
          >
            {loading
              ? isMember
                ? "Leaving..."
                : "Joining..."
              : isMember
                ? "Joined"
                : "Join"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommunityHeader;
