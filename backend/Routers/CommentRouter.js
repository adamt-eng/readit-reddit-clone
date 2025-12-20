import express from "express";
import {
  deleteComment,
  getUserComments,
  replyToComment,
} from "../Controllers/CommentController.js";

const router = express.Router();

router.post("/:commentId/reply", replyToComment);
router.get("/users/:id", getUserComments);
router.delete("/:id",deleteComment)

export default router;
