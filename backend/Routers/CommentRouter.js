import express from "express";
import auth from "../Middleware/AuthMiddleware.js";
import { getUserComments, replyToComment } from "../Controllers/CommentController.js";

const router = express.Router();

router.post("/:commentId/reply",replyToComment);
router.get("/users/:id",getUserComments);

export default router;
