import React, { useState, useRef } from "react";
import "./NotificationItem.css";
import { IoIosArrowForward } from "react-icons/io";
import { FaTrash } from "react-icons/fa";

const notificationIcons = {
  comment: "https://cdn-icons-png.flaticon.com/512/1380/1380338.png",
  upvote: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
  mod: "https://cdn-icons-png.flaticon.com/512/1828/1828970.png",
  system: "https://cdn-icons-png.flaticon.com/512/1828/1828859.png",
  follow: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
  default: "https://cdn-icons-png.flaticon.com/512/1827/1827429.png",
};

function timeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diff = Math.floor((now - past) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return past.toLocaleDateString();
}

export default function NotificationItem({ data, onRead }) {
  const { isRead, type, description, payload, timestamp } = data;
  const [slidingOut, setSlidingOut] = useState(false);
  const ref = useRef(null);

  // Keep in sync with CSS animation duration below
  const SLIDE_DURATION_MS = 360;

  const handleRead = (e) => {
    // if already read or already animating, just call onRead or ignore
    if (slidingOut) return;
    if (isRead) {
      // If already read, keep normal behavior (maybe open notification)
      return onRead && onRead();
    }

    // start slide-out animation
    setSlidingOut(true);

    // Force reflow to ensure animation starts properly across browsers (optional)
    // void ref.current?.offsetWidth;

    // After animation completes, call parent's onRead so it can remove/mark read
    setTimeout(() => {
      setSlidingOut(false);
      // Notify parent AFTER animation so parent can remove or mark read
      onRead && onRead();
    }, SLIDE_DURATION_MS);
  };

  const icon = notificationIcons[type] || notificationIcons.default;

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      className={[
        "notif-card",
        !isRead ? "notif-unread" : "",
        slidingOut ? "notif-slide-out" : "",
      ].join(" ")}
      aria-pressed={slidingOut ? "true" : "false"}
    >
      <div className="notif-left">
        <img className="notif-icon" src={icon} alt="" />
      </div>

      <div className="notif-main">
        <div className="notif-title">{type?.toUpperCase() || "NOTIFICATION"}</div>

        <div className="notif-preview">
          {description || payload?.message || "You have a new update"}
        </div>

        <div className="notif-time">{timeAgo(timestamp)}</div>
      </div>

      <div className="notif-right">
        <IoIosArrowForward size={20} className="notif-arrow" />
        <FaTrash onClick={handleRead} size={18} className="notif-menu" />
      </div>
    </div>
  );
}
