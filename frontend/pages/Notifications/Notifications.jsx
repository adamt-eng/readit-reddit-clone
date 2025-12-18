import { useEffect, useState } from "react";
import "./Notifications.css";
import NotificationItem from "../../components/NotificationItem/NotificationItem";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import axios from "axios";
import { useSocket } from "../../context/SocketContext";

// Format date
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
  const socket = useSocket();
  const [user, setUser] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEarlier, setShowEarlier] = useState(false);


//update ui notis and mark as read
const handleNotification = async (notification) => {
  setNotifications((prev) => {
    if (prev.some((n) => n._id === notification._id)) return prev;

    const formatted = {
      ...notification,
      isRead: true,
      timeAgoFormatted: formatTimeAgo(notification.createdAt),
    };

    return [formatted, ...prev];
  });

  await axios.patch(
    `${import.meta.env.VITE_API_URL}/notifications/${notification._id}/read`,
    {},
    { withCredentials: true }
  );
};

  // fetch user for real time updates
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/me`,
          { withCredentials: true },
        );
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };
    fetchUser();
  }, []);

  // fetch notis
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/notifications`,
          { withCredentials: true },
        );

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

  // real time updates
  useEffect(() => {
    if (!user?._id || !socket) return;
    socket.emit("register", user._id);
    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [user._id, user.id, socket]);

  // time based filtering
  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const recent = notifications.filter(
    (n) => now - new Date(n.createdAt).getTime() <= THREE_DAYS_MS,
  );

  const older = notifications.filter(
    (n) => now - new Date(n.createdAt).getTime() > THREE_DAYS_MS,
  );

  // DELETE HANDLING
  const deleteAll = () => {
    setNotifications([]);

    axios
      .delete(`${import.meta.env.VITE_API_URL}/notifications`, {
        withCredentials: true,
      })
      .catch(() => {});
  };

  const markOne = (id) => {
    setNotifications(
      notifications.filter((n) => (n._id!==id)),
    );

    axios
      .delete(
        `${import.meta.env.VITE_API_URL}/notifications/${id}`,
        { withCredentials: true },
      )
      .catch(() => {});
  };

  return (
    <div style={{ display: "flex" }}>
      <LeftSidebar/>
      <div className="notifs-page">
        <div className="notifs-header">
          <h2>Notifications</h2>

          {notifications.length > 0 && (
            <button className="header-btn" onClick={deleteAll}>
              Clear all
            </button>
          )}
        </div>

        {loading ? (
          <div className="no-new-message">Loading...</div>
        ) : (
          <div className="notifs-list">
            {recent.length > 0 ? (
              <>
                <h3 className="section-title">New</h3>

                {recent.map((n) => (
                  <NotificationItem
                    key={n._id}
                    data={n}
                    onDelete={() => markOne(n._id)}
                  />
                ))}
              </>
            ) : (
              <div className="no-new-message">
                No notifications in the last 3 days
              </div>
            )}

            {older.length > 0 && (
              <button
                className="expand-earlier-btn"
                onClick={() => setShowEarlier(!showEarlier)}
              >
                {showEarlier
                  ? "Hide older notifications ▲"
                  : "Show older notifications ▼"}
              </button>
            )}

            {showEarlier && older.length > 0 && (
              <>
                <h3 className="section-title">Older</h3>

                {older.map((n) => (
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