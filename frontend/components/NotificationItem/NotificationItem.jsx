/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import "./NotificationItem.css";
import { IoIosArrowForward } from "react-icons/io";
import { FaTrash } from "react-icons/fa";

const notificationIcons = {
  profile_view: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
  post_upvote: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
  comment_upvote: "https://cdn-icons-png.flaticon.com/512/1380/1380338.png",
  comment_reply: "https://cdn-icons-png.flaticon.com/512/1380/1380338.png",
  private_message: "https://cdn-icons-png.flaticon.com/512/1828/1828970.png",
  system: "https://cdn-icons-png.flaticon.com/512/1828/1828859.png",
  default: "https://cdn-icons-png.flaticon.com/512/1827/1827429.png",
};

function getNotificationContent(type, payload) {
  switch (type) {
    case "profile_view":
      return {
        title: "Someone checked you out 👀",
        message: payload?.message,
      };

    case "post_upvote":
      return {
        title: "Your post is getting love 🔥",
        message: payload?.message,
      };

    case "comment_upvote":
      return {
        title: "Your comment got an upvote 👍",
        message: payload?.message,
      };

    case "comment_reply":
      return {
        title: "New reply to your comment 💬",
        message: payload?.message,
      };

    case "private_message":
      return {
        title: "You have a new message ✉️",
        message: payload?.message,
      };

    default:
      return {
        title: "Notification",
        message: payload?.message || "You have a new update",
      };
  }
}

export default function NotificationItem({ data, onRead }) {
  const { isRead, type, payload,timeAgoFormatted} = data;
  const [slidingOut, setSlidingOut] = useState(false);
  const ref = useRef(null);

  const SLIDE_DURATION_MS = 360;

  const handleRead = () => {
    if (slidingOut) return;

    setSlidingOut(true);

    setTimeout(() => {
      setSlidingOut(false);
      onRead && onRead();
    }, SLIDE_DURATION_MS);
  };

  const icon = notificationIcons[type] || notificationIcons.default;
  const { title, message } = getNotificationContent(type, payload);

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
        <div className="notif-title">{title}</div>

        <div className="notif-preview">
          {message}
        </div>

        <div className="notif-time">{timeAgoFormatted}</div>
      </div>

      <div className="notif-right">
        <IoIosArrowForward size={20} className="notif-arrow" />
        <FaTrash onClick={handleRead} size={18} className="notif-menu" />
      </div>
    </div>
  );
}
