import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from "cookie-parser";
import http from "http";               
import { Server } from "socket.io";   
import auth from './Middleware/AuthMiddleware.js';
import AuthRouter from './Routers/AuthRouter.js';
import CommunityRouter from "./Routers/CommunityRouter.js";
import UserRouter from "./Routers/UserRouter.js";
import PostRouter from "./Routers/PostRouter.js";
import SearchRouter from "./Routers/SearchRouter.js"
import UploadRouter from "./Routers/UploadRouter.js";
import AiSummaryRouter from "./Routers/AiSummaryRouter.js";
import { fakeAuth } from './Middleware/FakeAuth.js';

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

// app.use(auth()); // add later after testing
app.use(fakeAuth());

app.use('/users', UserRouter);
app.use('/posts', PostRouter);
app.use('/communities', CommunityRouter);
app.use('/search', SearchRouter);
app.use("/upload", UploadRouter);
app.use('/ai-summary', AiSummaryRouter);

/* ------------ MONGO CONNECTION ------------ */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));



/* ===========================================
   SOCKET.IO SERVER (REAL-TIME LAYER)
   =========================================== */

const server = http.createServer(app);  

export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
  }
});

// Map<userId, socketId>
export const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // frontend: socket.emit("register", userId)
  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is online`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);

    // remove from online users
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} is offline`);
      }
    }
  });
});


/* ------------ START SERVER ------------ */

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
