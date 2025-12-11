import React, { useEffect, useState } from "react";
import "./Notifications.css";
import NotificationItem from "../../components/NotificationItem/NotificationItem";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import axios from "axios";
import { io } from "socket.io-client";


const socket = io("http://localhost:5000");

// Format date → "22m", "1h", "3d", etc.
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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEarlier, setShowEarlier] = useState(false);

  // ===============================
  // FETCH ALL NOTIFICATIONS
  // ===============================
 
  useEffect(() => {
     socket.on("notification",(notification)=>
      {
          setNotifications((prev) => [notification, ...prev]);
      })
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/notifications/69345c85481669617584618c"); ///changetoauth

        const formatted = res.data.map((n) => ({
          ...n,
          timeAgoFormatted: formatTimeAgo(n.createdAt),
        }));

        setNotifications(formatted);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // ===============================
  // READ / UNREAD HANDLING
  // ===============================
  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  const markAll = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));

    axios.put("/api/notifications/mark-all-read").catch(() => {});
  };

  const markOne = (id) => {
    setNotifications(
      notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      )
    );

    axios.put(`/api/notifications/${id}/read`).catch(() => {});
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="page-container">

      {/* LEFT SIDEBAR */}
      <LeftSidebar />

      {/* MAIN CONTENT */}
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

        {/* LOADING STATE */}
        {loading ? (
          <div className="no-new-message">Loading...</div>
        ) : (
          <div className="notifs-list">

            {/* NEW NOTIFICATIONS */}
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
              <div className="no-new-message">You're all caught up 🎉</div>
            )}

            {/* EXPAND EARLIER */}
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

            {/* EARLIER NOTIFICATIONS */}
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
        )}
      </div>
    </div>
  );
}
