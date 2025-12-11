import express from "express";
import {
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../Controllers/NotificationController.js";

const router = express.Router();

router.get("/:id",  getNotifications);
router.get("/unread", getUnreadNotifications);

router.patch("/:id/read", markAsRead);
router.patch("/read-all",  markAllAsRead);

router.delete("/:id", deleteNotification);
router.delete("/", deleteAllNotifications);

export default router;
