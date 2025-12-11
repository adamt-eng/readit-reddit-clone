import express from 'express';
import auth from "../Middleware/AuthMiddleware.js";
import { getOrGenerateSummaryForPost, generateSummaryForPost } from "../Controllers/AiSummaryController.js";

const router = express.Router();

router.get('/:postId', getOrGenerateSummaryForPost);
router.get('/:postId/generate', generateSummaryForPost);

export default router;