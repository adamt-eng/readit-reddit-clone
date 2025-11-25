// src/components/LeftSidebar.jsx
import './LeftSidebar.css';

export default function LeftSidebar() {
  const menuItems = [
    { icon: "🏠", label: "Home", active: true },
    { icon: "🔥", label: "Popular" },
    { icon: "💬", label: "Answers", badge: "BETA" }
  ];

  const exploreItems = [
    { icon: "🧭", label: "Explore" },
    { icon: "📋", label: "All" },
    { icon: "➕", label: "Start a community", special: true }
  ];

  return (
    <aside className="left-sidebar">
      <div className="sidebar-logo">
        <a href="/">
          <img src="/reddit-logo.svg" alt="Reddit" />
          <span className="reddit-text">reddit</span>
        </a>
      </div>

      <div className="sidebar-section">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`sidebar-item ${item.active ? "active" : ""}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
            {item.badge && <span className="beta-badge">{item.badge}</span>}
          </a>
        ))}
      </div>

      <hr className="sidebar-divider" />

      <div className="sidebar-section">
        {exploreItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`sidebar-item ${item.special ? "create-community" : ""}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </div>

      <hr className="sidebar-divider" />

      <div className="sidebar-section games-section">
        <div className="section-title">GAMES ON REDDIT</div>
        <div className="game-card">
          <div className="game-icon yellow">PG</div>
          <div>
            <div className="game-title">
              Pocket Grids <span className="new-badge">NEW</span>
            </div>
            <div className="game-desc">Daily mini crosswords</div>
            <div className="game-players">309K monthly players</div>
          </div>
        </div>
      </div>
    </aside>
  );
}