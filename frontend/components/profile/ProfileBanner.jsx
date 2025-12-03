// src/components/profile/ProfileBanner.jsx
import './styles/profile.css';

export default function ProfileBanner() {
  return (
    <div className="profile-banner-fullwidth">
      <img
        src="/src/assets/default-avatar.png"
        alt="User avatar"
        className="profile-avatar"
      />
    </div>
  );
}