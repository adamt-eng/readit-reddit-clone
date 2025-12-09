import express from 'express';
import { createCommunity,getCommunityByName,deleteCommunity } from "../Controllers/CommunityController.js";
import auth from "../Middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/",createCommunity);
router.get("/:name", getCommunityByName);
router.delete("/:name", deleteCommunity);
export default router;