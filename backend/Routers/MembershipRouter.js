import express from "express";
import { getMyJoinedCommunities } from "../Controllers/MembershipController.js";

const router = express.Router();

router.get("/me", getMyJoinedCommunities);

export default router;
