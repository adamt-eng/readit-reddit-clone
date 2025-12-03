import React, { useState } from "react";
import "./Notifications.css";
import dummyData from "../../data/dummydata";
import NotificationItem from "../../components/NotificationItem/NotificationItem";

// Convert Date → "22m", "1h", "3d", etc
function formatTimeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();

  const m = Math.floor(diff / (60 * 1000));
  if (m < 60) return `${m}m`;

  const h = Math.floor(diff / (60 * 60 * 1000));
  if (h < 24) return `${h}h`;

  const d = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (d < 30) return `${d}d`;

  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo`;

  return `${Math.floor(mo / 12)}y`;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(
    dummyData.notifications.map((n) => ({
      ...n,
      timeAgoFormatted: formatTimeAgo(n.createdAt),
    }))
  );

  const [showEarlier, setShowEarlier] = useState(false);

  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  const markAll = () => {
    setNotifications(
      notifications.map((n) => ({ ...n, isRead: true }))
    );
  };

  const markOne = (id) => {
    setNotifications(
      notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      )
    );
  };

  return (
    <div className="notifs-page">

      {/* Sticky Header */}
      <div className="notifs-header">
        <h2>Notifications</h2>

        {unread.length > 0 && (
          <button className="header-btn" onClick={markAll}>
            Mark all as read
          </button>
        )}
      </div>

      {/* EVERYTHING SCROLLS INSIDE THIS ONE LIST */}
      <div className="notifs-list">

        {/* NEW SECTION */}
        {unread.length > 0 ? (
          <>
            <h3 className="section-title">New</h3>

            {unread.map((n) => (
              <NotificationItem
                key={n._id}
                data={n}
                onRead={() => markOne(n._id)}
              />
            ))}
          </>
        ) : (
          <div className="no-new-message">You’re all caught up 🎉</div>
        )}

        {/* EARLIER BUTTON — INSIDE THE LIST (FIXES THE GAP) */}
        {read.length > 0 && (
          <button
            className="expand-earlier-btn"
            onClick={() => setShowEarlier(!showEarlier)}
          >
            {showEarlier
              ? "Hide earlier notifications ▲"
              : "Show earlier notifications ▼"}
          </button>
        )}

        {/* EARLIER SECTION */}
        {showEarlier && read.length > 0 && (
          <>
            <h3 className="section-title">Earlier</h3>

            {read.map((n) => (
              <NotificationItem
                key={n._id}
                data={n}
                onRead={() => markOne(n._id)}
              />
            ))}
          </>
        )}

      </div>
    </div>
  );
}
