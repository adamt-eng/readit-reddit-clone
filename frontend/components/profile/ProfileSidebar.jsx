import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/sidebar.css";

export default function ProfileSidebar({ user, isMyProfile }) {
  const [stats, setStats] = useState(null);

  // safe avatar src (fallback if missing)
  const avatarSrc =
    user?.avatarUrl && user.avatarUrl.trim() !== ""
      ? `http://localhost:5000${user.avatarUrl}`
      : "../../assets/default-avatar.png";

  useEffect(() => {
    if (!user?._id) return;

    const fetchStats = async () => {
      try {
        console.log("fetching stats");
        
        const res = await axios.get(
          `http://localhost:5000/users/stats/${user._id}`,
          { withCredentials: true }
        );
        console.log("Stats ",res.data);
        
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch user stats:", err);
      }
    };

    fetchStats();
  }, [user?._id]);

  return (
    <div className="profile-sidebar">
      <div className="profile-sidebar-top" />

      <img
        src={avatarSrc}
        alt="avatar"
        className="profile-sidebar-avatar"
      />

      <div className="profile-sidebar-info">
        <h2 className="profile-sidebar-name">{user?.username || "Loading..."}</h2>

        <p className="profile-sidebar-handle">u/{user?.username || "Loading..."}</p>

        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `http://localhost:5173/user/${user.username}`
            );
            alert("Profile link copied to clipboard");
          }}
        >
          Share
        </button>

        {/* Only show Edit Profile on YOUR OWN profile */}
        {isMyProfile && (
          <Link to="/edit-profile">
            <button className="edit-profile-sidebar-btn">
              Edit Profile
            </button>
          </Link>
        )}

        <div className="profile-stats-grid">
          <div className="stat-item">
            <div className="stat-value">
              {stats?.karma ?? user?.karma ?? 0}
            </div>
            <div className="stat-label"><strong>Karma</strong></div>
          </div>

          <div className="stat-item">
            <div className="stat-value">
              {stats?.postsCount ?? 0}
            </div>
            <div className="stat-label"><strong>Contributions</strong></div>
          </div>

          <div className="stat-item">
            <div className="stat-value">
              {stats?.communitiesCount ?? 0}
            </div>
            <div className="stat-label"><strong>Active in</strong></div>
          </div>

          <div className="stat-item">
            <div className="stat-value">
              {stats?.age ?? "0d"}
            </div>
            <div className="stat-label"><strong>Reddit age</strong></div>
          </div>
        </div>

        <div className="achievements-section">
          <div className="achievements-title">ACHIEVEMENTS</div>

          <div className="achievement-badges">
            <div className="achievement-badge">🏆</div>
            <div className="achievement-badge">📱</div>
            <div className="achievement-badge">🔒</div>
          </div>

          <div className="achievement-text">
            Feed Finder, Joined Reddit, Secured Account
          </div>

          <div className="achievement-footer">
            <span className="unlocked-count">3 unlocked</span>
            <a href="#" className="view-all-link">View All</a>
          </div>
        </div>
      </div>
    </div>
  );
}
