export default function EmptyState({title,message}) {
  return (
    <div className="empty-state">
      <img
        src="https://www.redditstatic.com/avatars/avatar_default_02_46D160.png"
        alt="Snoo"
        className="empty-snoo"
      />
      <h2 className="empty-title">{title}</h2>
      <p className="empty-text">
        {message}
      </p>
    </div>
  );
}