import express from "express";
import auth from "../Middleware/AuthMiddleware.js";
import {
  getPostableCommunities,
  createPost
} from "../Controllers/PostController.js";

const router = express.Router();

// Used by CreatePost page (dropdown)
router.get("/communities", getPostableCommunities);

// Used when user submits the post (TEMP: no auth)
router.post("/", createPost);
// router.post("/", auth, createPost); // enable later

export default router;
