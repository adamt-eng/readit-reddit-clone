import express from "express";
import auth from "../Middleware/AuthMiddleware.js";
import {
  getPostableCommunities,
  createPost
} from "../Controllers/PostController.js";

const router = express.Router();

// Used by CreatePost page (dropdown)
router.get("/communities", auth, getPostableCommunities);

// Used when user submits the post
router.post("/", auth, createPost);

export default router;
