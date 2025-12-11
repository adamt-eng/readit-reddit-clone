import express from 'express';
import auth from "../Middleware/AuthMiddleware.js";
import { 
    replyToComment,
    upvoteComment
 } from "../Controllers/CommentController.js";

const router = express.Router();

router.post("/:commentId/reply", replyToComment);
router.post("/:commentId/upvote", upvoteComment);

export default router;