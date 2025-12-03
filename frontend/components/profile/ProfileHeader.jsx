import avatarImg from "/src/assets/default-avatar.png";

export default function ProfileHeader({ user }) {
  return (
    <div className="profile-header">
      <img src={avatarImg} alt="avatar" className="header-avatar" />

      <div className="profile-info">
        <h1>{user.username}</h1>
        <p className="karma-line">
          Karma: {user.karma} • Cake day: {user.cakeDay}
        </p>
      </div>
    </div>
  );
}
