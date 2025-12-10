import express from "express";
import {
  searchPosts
} from "../Controllers/PostController.js";
import {
  searchCommunities
} from "../Controllers/CommunityController.js";
import {searchUsers} from "../Controllers/UserController.js";

const router = express.Router();

router.get("/posts", searchPosts);
router.get("/communities", searchCommunities);
router.get("/users", searchUsers);

export default router;
