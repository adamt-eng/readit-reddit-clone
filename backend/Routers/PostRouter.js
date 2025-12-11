import express from "express";
import auth from "../Middleware/AuthMiddleware.js";
import {
  getPostableCommunities,
  createPost,
  searchPosts,
  getPostsByUser,
  getPostById
} from "../Controllers/PostController.js";

import { 
  getCommentsForPost,
  createComment
} from "../Controllers/CommentController.js";

const router = express.Router();

/* -----------------------------
   COMMUNITY & CREATE POST APIs
------------------------------ */

// Used by CreatePost page (dropdown)
router.get("/communities", getPostableCommunities);

// Create a new post (TEMP no auth)
router.post("/", createPost);


/* -----------------------------
           COMMENTS
------------------------------ */

// Create a top-level comment under a post
router.post("/:postId/comments", createComment);

// Get all comments for a post
router.get("/:postId/comments", getCommentsForPost);


/* -----------------------------
       SEARCH & USER POSTS
------------------------------ */

router.get("/search", searchPosts);

// Get all posts by a user
router.get("/user/:userId", getPostsByUser);


/* -----------------------------
       SINGLE POST DETAILS
------------------------------ */

// Must be last!
router.get("/:postId", getPostById);

export default router;
