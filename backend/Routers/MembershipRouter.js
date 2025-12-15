import express from 'express';
import auth from "../Middleware/AuthMiddleware.js";
import { getMyJoinedCommunities } from '../Controllers/MembershipController.js';

const router = express.Router();

router.get("/me",  getMyJoinedCommunities);


export default router;