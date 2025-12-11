import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from "cookie-parser";
import auth from './Middleware/AuthMiddleware.js';
import AuthRouter from './Routers/AuthRouter.js';
import CommunityRouter from "./Routers/CommunityRouter.js";
import UserRouter from "./Routers/UserRouter.js";
import PostRouter from "./Routers/PostRouter.js";
import SearchRouter from "./Routers/SearchRouter.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173",
      "http://localhost:5174"],
    credentials: true                  
  })
);



///////routers///////
app.use('/authentication', AuthRouter);

//app.use(auth()); commented till all apis are working and tested to add authentication later

app.use('/users', UserRouter);
app.use('/posts', PostRouter);
//app.use('/comments', CommentRouter);
app.use('/communities', CommunityRouter);
app.use('/search',SearchRouter)
//app.use('/votes', VoteRouter);
//app.use('/memberships', MembershipRouter);
//app.use('/notifications', NotificationRouter);
//app.use('/ai-summary', AiSummaryRouter);




//mongo db connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;