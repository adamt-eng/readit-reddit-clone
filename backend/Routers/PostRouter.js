import express from "express";
import auth from "../Middleware/AuthMiddleware.js";
import {
  getPostableCommunities,
  createPost,
  searchPosts,
  getPostsByUser,
  getPostById,
  upvotePost,
  downvotePost,
  getPersonalizedFeed
} from "../Controllers/PostController.js";

import { 
  getCommentsForPost,
  createComment
} from "../Controllers/CommentController.js";

const router = express.Router();

/* -----------------------------
   COMMUNITY & CREATE POST APIs
------------------------------ */

// Communities dropdown for CreatePost page
router.get("/communities", getPostableCommunities);

// Create a new post (TEMP no auth)
router.post("/", createPost);

/* -----------------------------
      PERSONALIZED FEED
------------------------------ */

// Get personalized feed (supports guest mode with no userId)
router.get("/feed", getPersonalizedFeed);



/* -----------------------------
           COMMENTS
------------------------------ */

// Create a top-level comment under a post
router.post("/:postId/comments", createComment);

// Get all comments for a post
router.get("/:postId/comments", getCommentsForPost);


/* -----------------------------
        POST VOTING
------------------------------ */

// Upvote a post
router.post("/:postId/upvote", upvotePost);
// Downvote a post
router.post("/:postId/downvote", downvotePost);


/* -----------------------------
       SEARCH & USER POSTS
------------------------------ */

router.get("/search", searchPosts);

// Get all posts by a user
router.get("/user/:userId", getPostsByUser);


/* -----------------------------
       SINGLE POST DETAILS
------------------------------ */

// Must stay last!
router.get("/:postId", getPostById);

export default router;
