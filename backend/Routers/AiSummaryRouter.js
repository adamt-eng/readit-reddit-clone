import express from "express";
import {
  getOrGenerateSummaryForPost,
  generateSummaryForPost,
} from "../Controllers/AiSummaryController.js";
import auth from "../Middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/:postId", getOrGenerateSummaryForPost);
router.get("/:postId/generate", generateSummaryForPost);

export default router;
