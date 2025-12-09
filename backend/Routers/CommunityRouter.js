import express from "express";
import {
  createCommunity,
  getCommunityByName,
  deleteCommunity,
  joinCommunity
} from "../Controllers/CommunityController.js";
import auth from "../Middleware/AuthMiddleware.js";

const router = express.Router();


router.post("/:name/join", auth, joinCommunity);

router.post("/", createCommunity);
router.get("/:name", getCommunityByName);
router.delete("/:name", deleteCommunity);

export default router;
