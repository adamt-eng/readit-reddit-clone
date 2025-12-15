import express from "express";
import auth from "../Middleware/AuthMiddleware.js";
import { votePost, voteComment } from "../Controllers/VoteController.js";

const router = express.Router();

router.post("/posts/:id", auth, votePost);
router.post("/comments/:commentId", auth, voteComment);

export default router;
