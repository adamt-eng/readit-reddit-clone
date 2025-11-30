import React from "react";
import "./NotificationItem.css";
import { IoIosArrowForward } from "react-icons/io";
import { FiMoreHorizontal } from "react-icons/fi";

export default function NotificationItem({ data, onRead }) {
  return (
    <div
      className={`notif-card ${data.read ? "" : "notif-unread"}`}
      onClick={onRead}
    >
      <div className="notif-left">
        <img
          className="notif-icon"
          src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${data.sourceUser.username}`}
          alt=""
        />
      </div>

      <div className="notif-main">
        <div className="notif-title"><b>{data.messageTitle}</b></div>

        <div className="notif-preview">{data.messagePreview}</div>

        <div className="notif-time">{data.timeAgo}</div>
      </div>

      <div className="notif-right">
        <IoIosArrowForward size={20} className="notif-arrow" />
        <FiMoreHorizontal size={20} className="notif-menu" />
      </div>
    </div>
  );
}
