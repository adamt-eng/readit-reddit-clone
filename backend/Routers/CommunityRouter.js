import express from "express";
import {
  createCommunity,
  getCommunityByName,
  deleteCommunity,
  joinCommunity,
  getUserCommunities,
  leaveCommunity,
  getAllCommunities,
  getMembershipStatus,
  updateCommunity,
} from "../Controllers/CommunityController.js";

import auth from "../Middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/users/:id", getUserCommunities);

//specific routes first
router.get("/:name/membership",getMembershipStatus);
router.post("/:name/join", joinCommunity);
router.delete("/:name/leave",  leaveCommunity);
router.patch("/:name",  updateCommunity);

//generic routes after
router.post("/", createCommunity);
router.get("/", getAllCommunities);
router.get("/:name", getCommunityByName);
router.delete("/:name", deleteCommunity);

export default router;
