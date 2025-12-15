import express from 'express';
import auth from "../Middleware/AuthMiddleware.js";
import { votePost } from '../Controllers/VoteController.js';

const router = express.Router();

router.post("/:id",auth,votePost)

export default router;