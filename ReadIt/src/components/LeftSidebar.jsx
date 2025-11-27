// src/components/LeftSidebar.jsx
import { NavLink } from 'react-router-dom';
import './LeftSidebar.css';

export default function LeftSidebar() {
  const menuItems = [
    { icon: "🏠", label: "Home", to: "/" },
    { icon: "🔥", label: "Popular", to: "/popular" },
    { icon: "💬", label: "Answers", to: "/answers", badge: "BETA" }
  ];

  const exploreItems = [
    { icon: "🧭", label: "Explore", to: "/explore" },
    { icon: "📋", label: "All", to: "/all" },
    { icon: "➕", label: "Start a community", to: "/create", special: true }
  ];

  return (
    <aside className="left-sidebar">
      <div className="sidebar-logo">
        <NavLink to="/">
          <img src="/reddit-logo.svg" alt="Reddit" />
          <span className="reddit-text">reddit</span>
        </NavLink>
      </div>

      <div className="sidebar-section">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
            end
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && <span className="beta-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </div>

      <hr className="sidebar-divider" />

      <div className="sidebar-section">
        {exploreItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-item ${item.special ? "create-community" : ""} ${
                isActive ? "active" : ""
              }`.trim()
            }
            end
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
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