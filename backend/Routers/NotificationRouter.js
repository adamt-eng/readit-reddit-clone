import express from "express";
import {
  createNotisController
} from "../Controllers/NotificationController.js";

export default function createNotificationRouter({ io, onlineUsers }) {

  const router = express.Router();

  // create controller instance 
  const NotificationController = createNotisController({ io, onlineUsers });

  router.get("/", NotificationController.getNotifications);

  router.get("/unread", NotificationController.getUnreadNotifications);

  router.get("/count/:id", NotificationController.getUnreadCount);

  router.patch("/:id/read", NotificationController.markAsRead);

  router.patch("/read-all", NotificationController.markAllAsRead);


  router.delete("/:id", NotificationController.deleteNotification);

  router.delete("/", NotificationController.deleteAllNotifications);

  return router;
}
