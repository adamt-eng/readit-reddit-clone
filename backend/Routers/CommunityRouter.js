import express from "express";
import {
  createCommunity,
  getCommunityByName,
  deleteCommunity,
  joinCommunity,
  getUserCommunities,
  leaveCommunity,
  getAllCommunities
} from "../Controllers/CommunityController.js";

const router = express.Router();

router.get("/users/:id",getUserCommunities);
router.post("/:name/join", joinCommunity);
router.post("/",createCommunity);
router.get("/:name", getCommunityByName);
router.delete("/:name",deleteCommunity);
router.post("/:name/leave",leaveCommunity);
router.get("/",getAllCommunities);

export default router;
