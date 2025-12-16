import React, { useEffect, useState } from "react";
import "./Notifications.css";
import NotificationItem from "../../components/NotificationItem/NotificationItem";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import axios from "axios";
import { io } from "socket.io-client";
import { useRef } from "react";


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
  const [user,setUser] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEarlier, setShowEarlier] = useState(false);

  const socketRef = useRef(null);


  const handleNotification = async (notification) => {
    await axios.patch(`http://localhost:5000/notifications/${notification._id}/read`,{},{withCredentials:true})
  const formatted = {
    ...notification,
    isRead: true, 
    timeAgoFormatted: formatTimeAgo(notification.createdAt),
  };
  console.log("henanaaaa",formatted)
  setNotifications((prev) => [formatted, ...prev]);
};


  //fetch user for real time updates
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/users/me",
          { withCredentials: true }
        );
        setUser(res.data);
        console.log("userrrr",res.data)
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    }
    fetchUser();},[])

  // fetch notis
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/notifications",
          { withCredentials: true }
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

  //real time sockets
  //create socket
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000");
    }
  }, []);
  
  // real time updates
useEffect(() => {
  console.log(user.id,socketRef.current)
  if (!user?._id || !socketRef.current) return;
  socketRef.current.emit("register", user._id);
  socketRef.current.on("notification",handleNotification);
  return () => {
    socketRef.current.off("notification", handleNotification);
  };
}, [user?._id]);

  

  // time based filtering
  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const recent = notifications.filter(
    (n) => now - new Date(n.createdAt).getTime() <= THREE_DAYS_MS
  );

  const older = notifications.filter(
    (n) => now - new Date(n.createdAt).getTime() > THREE_DAYS_MS
  );

  
  // DELETE HANDLING
  const deleteAll = () => {
    setNotifications([]);

    axios
      .delete("http://localhost:5000/notifications", {
        withCredentials: true,
      })
      .catch(() => {});
  };

  const markOne = (id) => {
    setNotifications(
      notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      )
    );

    axios
      .patch(
        `http://localhost:5000/notifications/${id}/read`,
        {},
        { withCredentials: true }
      )
      .catch(() => {});
  };


  return (
    <div className="page-container">
      {/* LEFT SIDEBAR */}
      <LeftSidebar />

      {/* MAIN CONTENT */}
      <div className="notifs-page">
        {/* Sticky Header */}
        <div className="notifs-header">
          <h2>Notifications</h2>

          {notifications.length > 0 && (
            <button className="header-btn" onClick={deleteAll}>
              Clear all
            </button>
          )}
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="no-new-message">Loading...</div>
        ) : (
          <div className="notifs-list">
            {/* RECENT NOTIFICATIONS */}
            {recent.length > 0 ? (
              <>
                <h3 className="section-title">New</h3>

                {recent.map((n) => (
                  <NotificationItem
                    key={n._id}
                    data={n}
                    onRead={() => markOne(n._id)}
                  />
                ))}
              </>
            ) : (
              <div className="no-new-message">
                No notifications in the last 3 days
              </div>
            )}

            {/* EXPAND OLDER */}
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

            {/* OLDER NOTIFICATIONS */}
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
