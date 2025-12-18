import express from "express";
import auth from "../Middleware/AuthMiddleware.js";
import { searchPosts } from "../Controllers/PostController.js";
import {
  searchCommunities,
  getTopCommunities,
} from "../Controllers/CommunityController.js";
import { searchUsers } from "../Controllers/UserController.js";

const router = express.Router();

router.get("/posts",auth,  searchPosts);
router.get("/communities",auth,  searchCommunities);
router.get("/users",auth, searchUsers);

router.get("/top-communities", getTopCommunities);

export default router;
