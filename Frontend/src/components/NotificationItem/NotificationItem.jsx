import React from "react";
import "./NotificationItem.css";
import { IoIosArrowForward } from "react-icons/io";
import { FiMoreHorizontal } from "react-icons/fi";

export default function NotificationItem({ data, onRead }) {
  const { isRead, payload, timeAgoFormatted } = data;

  return (
    <div
      className={`notif-card ${!isRead ? "notif-unread" : ""}`}
      onClick={onRead}
    >
      <div className="notif-left">
        <img
          className="notif-icon"
          src={`https://api.dicebear.com/7.x/identicon/svg?seed=${payload.fromUser}`}
          alt=""
        />
      </div>

      <div className="notif-main">
        <div className="notif-title">
          {payload.message || "New activity"}
        </div>

        <div className="notif-preview">
          From: <strong>{payload.fromUser}</strong>
        </div>

        <div className="notif-time">{timeAgoFormatted}</div>
      </div>

      <div className="notif-right">
        <IoIosArrowForward size={20} className="notif-arrow" />
        <FiMoreHorizontal size={18} className="notif-menu" />
      </div>
    </div>
  );
}
