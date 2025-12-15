import express from "express";
import auth from "../Middleware/AuthMiddleware.js";
import {
  getPostableCommunities,
  createPost,
  searchPosts,
  getPostsByUser,
  getPostById,
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
router.get("/communities",auth, getPostableCommunities);

// Create a new post (TEMP no auth)
router.post("/",auth, createPost);

/* -----------------------------
      PERSONALIZED FEED
------------------------------ */

// Get personalized feed (supports guest mode with no userId)
router.get("/feed", getPersonalizedFeed);



/* -----------------------------
           COMMENTS
------------------------------ */

// Create a top-level comment under a post
router.post("/:postId/comments",auth, createComment);

// Get all comments for a post
router.get("/:postId/comments",auth, getCommentsForPost);




/* -----------------------------
       SEARCH & USER POSTS
------------------------------ */

router.get("/search",auth, searchPosts);

// Get all posts by a user
router.get("/user/:userId",auth, getPostsByUser);


/* -----------------------------
       SINGLE POST DETAILS
------------------------------ */

// Must stay last!
router.get("/:postId",auth, getPostById);

export default router;
