import express from "express";
import {
  createCommunity,
  getCommunityByName,
  deleteCommunity,
  joinCommunity,
  getUserCommunities,
  leaveCommunity
} from "../Controllers/CommunityController.js";
import auth from "../Middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/users/:id",getUserCommunities);
router.post("/:name/join", joinCommunity);
router.post("/",createCommunity);
router.get("/:name", getCommunityByName);
router.delete("/:name",deleteCommunity);
router.post("/:name/leave",leaveCommunity)

export default router;
