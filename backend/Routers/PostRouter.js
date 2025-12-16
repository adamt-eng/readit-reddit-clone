import express from "express";
import auth from "../Middleware/AuthMiddleware.js";
import {
  getPostableCommunities,
  createPost,
  searchPosts,
  getPostsByUser,
  getPostById,
  getPersonalizedFeed,
  getPopularPosts,
  getUserPosts,
  deletePost
} from "../Controllers/PostController.js";

import { 
  getCommentsForPost,
  createComment
} from "../Controllers/CommentController.js";

const router = express.Router();

router.get("/communities",auth, getPostableCommunities);

// Create a new post 
router.post("/",auth, createPost);

// Get personalized feed (supports guest mode with no userId)
router.get("/feed", getPersonalizedFeed);

router.get("/popular", getPopularPosts);

// Create a top-level comment under a post
router.post("/:postId/comments",auth, createComment);

// Get all comments for a post
router.get("/:postId/comments",auth, getCommentsForPost);

router.get("/search",auth, searchPosts);

// Get user posts
router.get("/me",auth,getUserPosts);

//delete post
router.delete("/:id",auth,deletePost);

// Must stay last
router.get("/:postId",auth, getPostById);

export default router;
