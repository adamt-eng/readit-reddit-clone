import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import auth from './Middleware/AuthMiddleware.js';
import AuthRouter from './Routes/AuthRouter.js';

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




//mongo db connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
export default app;