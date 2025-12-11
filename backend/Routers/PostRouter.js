import express from "express";
import auth from "../Middleware/AuthMiddleware.js";
import {
  getPostableCommunities,
  createPost,
  searchPosts,
  getPostsByUser,
  getPostById
} from '../Controllers/PostController.js';

const router = express.Router();

// Used by CreatePost page (dropdown)
router.get("/communities", getPostableCommunities);

// Used when user submits the post (TEMP: no auth)
router.post("/", createPost);
// router.post("/", auth, createPost); // enable later

// search posts (for global search page)
router.get('/search', searchPosts);

// get all posts by a user  (for profile page)
router.get('/user/:userId', getPostsByUser);

// get post by id (for post details page)
router.get('/:postId', getPostById);



export default router;
