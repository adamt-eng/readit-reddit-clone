import express from "express";
import auth from "../Middleware/AuthMiddleware.js";
import { votePost, voteComment, getUserPostVotes } from "../Controllers/VoteController.js";

const router = express.Router();

router.post("/posts/:id", votePost);
router.post("/comments/:commentId",  voteComment);
router.get("/me",getUserPostVotes);

export default router;
