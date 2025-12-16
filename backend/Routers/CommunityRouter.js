import express from "express";
import {
  createCommunity,
  getCommunityByName,
  deleteCommunity,
  joinCommunity,
  getUserCommunities
} from "../Controllers/CommunityController.js";
import auth from "../Middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/me",getUserCommunities);
router.post("/:name/join", joinCommunity);
router.post("/",createCommunity);
router.get("/:name", getCommunityByName);
router.delete("/:name",deleteCommunity);

export default router;
