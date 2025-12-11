import express from 'express';
import auth from "../Middleware/AuthMiddleware.js";
import { 
    replyToComment
 } from "../Controllers/CommentController.js";

const router = express.Router();

router.post("/:commentId/reply", replyToComment);



export default router;