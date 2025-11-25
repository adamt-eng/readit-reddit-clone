import React from 'react';

export default function AboutSection({ user }) {
  return (
    <div className="card about-section">
      <div className="about-title">
        <h3>About u/{user.username}</h3>
      </div>

      <div className="stats-grid">
        <div className="stat-row">
          <span className="stat-label">Karma</span>
          <span className="stat-value">{user.karma}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Reddit Age</span>
          <span className="stat-value">{user.redditAge}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Followers</span>
          <span className="stat-value">{user.followers}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Gold Earned</span>
          <span className="stat-value">{user.gold}</span>
        </div>
      </div>

      <hr />

      <h4 style={{ margin: '16px 0 12px', fontWeight: 'bold' }}>Achievements</h4>
      <div className="achievement">
        <div className="achievement-icon">Shield</div>
        <div>
          <div style={{ fontWeight: '600', fontSize: '14px' }}>Joined Reddit: Secured Account</div>
          <div style={{ fontSize: '12px', color: '#555' }}>Verified email</div>
        </div>
      </div>
      <div style={{ textAlign: 'right', marginTop: '12px' }}>
        <button style={{ color: '#0079d3', background: 'none', border: 'none', fontSize: '13px', cursor: 'pointer' }}>
          View All
        </button>
      </div>
    </div>
  );
}