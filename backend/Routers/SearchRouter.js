import express from "express";
import {
  searchPosts
} from "../Controllers/PostController.js";
import {
  searchCommunities, getTopCommunities
} from "../Controllers/CommunityController.js";
import {searchUsers} from "../Controllers/UserController.js";

const router = express.Router();

router.get("/posts", searchPosts);
router.get("/communities", searchCommunities);
router.get("/users", searchUsers);

router.get("/top-communities", getTopCommunities);

export default router;
