import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bannerImg from "../../../assets/moviebanner.jpg";
import iconImg from "../../../assets/movieicon.webp";
import "./CommunityHeader.css";

function CommunityHeader({ community }) {
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!community) return null;

  const handleCreatePost = () => {
    navigate(`/create-post?community=${encodeURIComponent(community.name)}`);
  };

  const handleJoin = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/communities/${encodeURIComponent(
          community.name
        )}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Join failed");
        return;
      }

      setJoined(true);
    } catch (err) {
      console.error(err);
      alert("Join failed (network/server error)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="communityHeader">
      <div className="bannerContainer">
        <img src={bannerImg} alt="banner" className="banner" />
      </div>

      <div className="info">
        <img src={iconImg} alt="icon" className="communityIcon" />

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
            onClick={handleJoin}
            disabled={loading || joined}
          >
            {joined ? "Joined" : loading ? "Joining..." : "Join"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommunityHeader;
