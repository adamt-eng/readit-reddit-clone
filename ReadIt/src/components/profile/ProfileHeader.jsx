// src/components/profile/ProfileHeader.jsx
/*
export default function ProfileHeader({ user }) {
  return (
    <div className="profile-header-card">
      <div className="profile-header-content">
        <div className="username-section">
          <h1 className="display-name">u/{user.username}</h1>
          <div className="karma-cake">
            Karma: {user.karma}  •  Cake day: {user.cakeDay}
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn-share">Share</button>
          <button className="btn-edit">Edit Profile</button>
        </div>
      </div>
    </div>
  );
}
*/
// src/components/profile/ProfileHeader.jsx
export default function ProfileHeader() {
  return (
    <div className="profile-header">
      <div className="profile-info">
        <h1>u/Moist_Barber_9724</h1>
        <p className="karma-line">Karma: 1 • Cake day: November 2024</p>
      </div>
      <div className="profile-buttons">
        <button className="btn-share">Share</button>
        <button className="btn-edit">Edit Profile</button>
      </div>
    </div>
  );
}