import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import auth from "./Middleware/AuthMiddleware.js";

import AuthRouter from "./Routers/AuthRouter.js";
import CommunityRouter from "./Routers/CommunityRouter.js";
import UserRouter from "./Routers/UserRouter.js";
import PostRouter from "./Routers/PostRouter.js";
import SearchRouter from "./Routers/SearchRouter.js";
import UploadRouter from "./Routers/UploadRouter.js";
import AiSummaryRouter from "./Routers/AiSummaryRouter.js";
import CommentRouter from "./Routers/CommentRouter.js";
import DMRouter from "./Routers/DMRouter.js";
import VoteRouter from "./Routers/VoteRouter.js";
import MembershipRouter from "./Routers/MembershipRouter.js";
import NotificationRouter from "./Routers/NotificationRouter.js";

// load env vars
dotenv.config();

// app setup
const app = express();
const PORT = process.env.PORT || 5000;

// static uploads
app.use("/uploads", express.static("uploads"));

// body + cookies
app.use(express.json());
app.use(cookieParser());

// cors
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// routes
app.use("/authentication", AuthRouter);
app.use("/users", auth, UserRouter);
app.use("/posts", PostRouter);
app.use("/votes", auth, VoteRouter);
app.use("/communities", auth, CommunityRouter);
app.use("/search", auth, SearchRouter);
app.use("/upload", auth, UploadRouter);
app.use("/ai-summary", auth, AiSummaryRouter);
app.use("/comments", auth, CommentRouter);
app.use("/memberships", auth, MembershipRouter);

// mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// socket server
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  },
});

// online users map
export const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is online`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);

    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} is offline`);
        break;
      }
    }
  });
});

// socket-aware routes
app.use("/dm", DMRouter({ io, onlineUsers }));
app.use("/notifications", auth, NotificationRouter({ io, onlineUsers }));

// start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
