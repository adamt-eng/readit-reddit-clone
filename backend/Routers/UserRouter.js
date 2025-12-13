import express from "express";
import auth from "../Middleware/AuthMiddleware.js";
import {
  getUserById,
  searchUsers,
  updateUserProfile,
  getProfile,
  updateMyProfile,
} from "../Controllers/UserController.js";

const router = express.Router();

// /users/search?q=...
router.get("/search", searchUsers);

// ✅ MY PROFILE (no ID in URL)
router.get("/me", auth, getProfile);
router.patch("/me", auth, updateMyProfile);

// /users/:id  (get profile)
router.get("/:id", getUserById);

// /users/:id  (edit profile)  (admin/optional — keep it)
router.patch("/:id", updateUserProfile);

export default router;
