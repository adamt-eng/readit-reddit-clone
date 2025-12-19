import express from "express";
import auth from "../Middleware/AuthMiddleware.js";
import {
  getPostableCommunities,
  createPost,
  searchPosts,
  getPostById,
  getPersonalizedFeed,
  getPopularPosts,
  getUserPosts,
  deletePost,
  getPostsByCommunity,
  getGuestFeed,
  savePost,
  unsavePost,
  getSavedPosts,
} from "../Controllers/PostController.js";

import {
  getCommentsForPost,
  createComment,
} from "../Controllers/CommentController.js";

const router = express.Router();

router.get("/communities", auth, getPostableCommunities);

// Create a new post
router.post("/", auth, createPost);

router.get("/community/:name",auth, getPostsByCommunity);

// Get personalized feed
router.get("/feed/me",auth, getPersonalizedFeed);

router.get("/feed/guest", getGuestFeed);

router.get("/popular", getPopularPosts);

// Create a top-level comment under a post
router.post("/:postId/comments", auth, createComment);

// Get all comments for a post
router.get("/:postId/comments", auth, getCommentsForPost);

router.get("/search", auth, searchPosts);

// Get user posts
router.get("/users/:id", auth, getUserPosts);
router.get("/saved",auth,getSavedPosts);

//delete post
router.delete("/:id", auth, deletePost);

// Must stay last
router.get("/:postId", auth, getPostById);

//save
router.patch("/save/:id",auth,savePost);
router.patch("unsave/:id",unsavePost)

export default router;
