// src/components/profile/ProfileSidebar.jsx
import { Link } from 'react-router-dom';   // ← ADD THIS
import './styles/sidebar.css';

export default function ProfileSidebar() {
  return (
    <div className="profile-sidebar">
      <div className="profile-sidebar-top" />
      
      <img
        src="/src/assets/default-avatar.png"
        alt="avatar"
        className="profile-sidebar-avatar"
      />

      <div className="profile-sidebar-info">
        <h2 className="profile-sidebar-name">Moist_Barber_9724</h2>
        <p className="profile-sidebar-handle">u/Moist_Barber_9724</p>

        <button>Share</button>

        {/* ← NEW: EDIT PROFILE BUTTON */}
       <Link to="/edit-profile">
        <button className="edit-profile-sidebar-btn">Edit Profile</button>
        </Link>


        <div className="profile-stats-grid">
          <div className="stat-item">
            <div className="stat-value">0</div>
            <div className="stat-label">Followers</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">1</div>
            <div className="stat-label">Karma</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">0</div>
            <div className="stat-label">Contributions</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">0</div>
            <div className="stat-label">Active in &gt;</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">0 d</div>
            <div className="stat-label">Reddit Age</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">0</div>
            <div className="stat-label">Gold earned</div>
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