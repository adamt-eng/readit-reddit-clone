import express from "express";
import { changeMyPassword } from "../Controllers/UserController.js";
import auth from "../Middleware/AuthMiddleware.js";
import {
  getUserById,
  searchUsers,
  updateUserProfile,
  getProfile,
  updateMyProfile,
  getUserStats,
} from "../Controllers/UserController.js";

const router = express.Router();

// /users/search?q=...
router.get("/search", searchUsers);

// MY PROFILE (no ID in URL)
router.get("/me",  getProfile);
router.patch("/me", updateMyProfile);

// /users/:id  (get profile)
router.get("/:id", getUserById);

//get user stats
router.get("/stats/:id", getUserStats);

// /users/:id  (edit profile)
router.patch("/:id", updateUserProfile);

router.patch("/me/password", changeMyPassword);

export default router;
