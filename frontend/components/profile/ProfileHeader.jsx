import defaultAvatar from "../../assets/default-avatar.png";

export default function ProfileHeader({ user }) {
  const avatarSrc = user?.avatarUrl
    ? `${import.meta.env.VITE_API_URL}${user.avatarUrl}`
    : defaultAvatar;

  return (
    <div className="profile-header">
      <img src={avatarSrc} alt="avatar" className="header-avatar" />

      <div className="profile-info">
        <h1>{user?.username}</h1>
        <p className="karma-line">
          Karma: {user?.karma}
        </p>
      </div>
    </div>
  );
}
