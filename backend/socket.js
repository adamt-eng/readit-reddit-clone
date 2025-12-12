import { Server } from "socket.io";
import mongoose from "mongoose";
import Notification from "./Models/Notification.js";

export function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  const onlineUsers = new Map();

 function addUser(userId, socketId) {
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socketId);
  }

  function removeSocket(socketId) {
    for (const [userId, sockets] of onlineUsers.entries()) {
      if (sockets.has(socketId)) {
        sockets.delete(socketId);
        if (sockets.size === 0) onlineUsers.delete(userId);
        return;
      }
    }
  }

  async function emitNotification(userId, data) {
    const uid = userId.toString();
    const sockets = onlineUsers.get(uid);

    if (sockets && sockets.size > 0) {
      sockets.forEach(sid => io.to(sid).emit("notification", data));
      return { realtime: true };
    }

    return { realtime: false };
  }

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("register", (userId) => {
      if (!mongoose.Types.ObjectId.isValid(userId)) return;
      addUser(userId.toString(), socket.id);
      console.log("Registered user:", userId, "→", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      removeSocket(socket.id);
    });
  });

  return {
    io,
    emitNotification,
    onlineUsers
  };
}
