import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from "cookie-parser";
import http from "http";    

// Routers
import auth from './Middleware/AuthMiddleware.js';
import AuthRouter from './Routers/AuthRouter.js';
import CommunityRouter from "./Routers/CommunityRouter.js";
import UserRouter from "./Routers/UserRouter.js";
import PostRouter from "./Routers/PostRouter.js";
import SearchRouter from "./Routers/SearchRouter.js";
import UploadRouter from "./Routers/UploadRouter.js";
import AiSummaryRouter from "./Routers/AiSummaryRouter.js";
import NotificationRouter from './Routers/NotificationRouter.js';
import CommentRouter from './Routers/CommentRouter.js';

// ONLY NECESSARY IMPORT
import { initSocket } from "./socket.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

/* ------------ EXPRESS MIDDLEWARE ------------ */

app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
  })
);

/* ------------ ROUTERS ------------ */

app.use('/authentication', AuthRouter);
//app.use(auth());
app.use('/users', UserRouter);
app.use('/posts', PostRouter);
app.use('/communities', CommunityRouter);
app.use('/notifications',NotificationRouter);
app.use('/search', SearchRouter);
app.use("/upload", UploadRouter);
app.use('/ai-summary', AiSummaryRouter);
app.use('/comments', CommentRouter);

/* ------------ MONGO CONNECTION ------------ */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

/* ===========================================
   SOCKET.IO SERVER — ONLY PART YOU WANTED FIXED
   =========================================== */

const server = http.createServer(app);

//REPLACE ALL OLD SOCKET CODE WITH THIS ONE LINE:
export const socketSystem = initSocket(server);

export const io = socketSystem.io;
export const onlineUsers = socketSystem.onlineUsers;
export const emitNotification = socketSystem.emitNotification;


/* ------------ START SERVER ------------ */

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
