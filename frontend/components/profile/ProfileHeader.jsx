import defaultAvatar from "../../assets/default-avatar.png";

export default function ProfileHeader({ user }) {
  const avatarSrc = user?.avatarUrl
    ? `http://localhost:5000${user.avatarUrl}`
    : defaultAvatar;

  return (
    <div className="profile-header">
      <img src={avatarSrc} alt="avatar" className="header-avatar" />

      <div className="profile-info">
        <h1>{user?.username}</h1>
        <p className="karma-line">
          Karma: {user?.karma} • Cake day: {user?.cakeDay}
        </p>
      </div>
    </div>
  );
}
