import React, { useState } from "react";
import "./Notifications.css";
import dummyData from "../../data/dummyData";
import { FiMoreHorizontal } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";

export default function Notifications() {
  const [notifications, setNotifications] = useState(dummyData.notifications);

  const markAll = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="notifs-page">
      <div className="notifs-header">
        <h2>Notifications</h2>
        <button className="header-btn" onClick={markAll}>Mark all as read</button>
      </div>

      <div className="notifs-list">
        {notifications.map(n => (
          <NotificationItem
            key={n.id}
            data={n}
            onRead={() =>
              setNotifications(notifications.map(x => x.id === n.id ? { ...x, read: true } : x))
            }
          />
        ))}
      </div>
    </div>
  );
}
