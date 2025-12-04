export default function EmptyState() {
  return (
    <div className="empty-state">
      <img
        src="https://www.redditstatic.com/avatars/avatar_default_02_46D160.png"
        alt="Snoo"
        className="empty-snoo"
      />
      <h2 className="empty-title">You don't have any posts yet</h2>
      <p className="empty-text">
        Once you post to a community, it'll show up here. If you'd rather hide your posts, update your settings.
      </p>
      <button className="btn-settings">Update Settings</button>
    </div>
  );
}