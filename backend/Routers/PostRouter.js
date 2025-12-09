import express from 'express';
import auth from "../Middleware/AuthMiddleware.js";

import {
    getPostableCommunities
} from "../Controllers/PostController.js";

const router = express.Router();

router.get('/communities', getPostableCommunities);
export default router;