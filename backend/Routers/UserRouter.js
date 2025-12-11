import express from "express";
import {
  getUserById,
  searchUsers,
  updateUserProfile,
} from "../Controllers/UserController.js";

const router = express.Router();

// /users/search?q=...
router.get("/search", searchUsers);

// /users/:id  (get profile)
router.get("/:id", getUserById);

// /users/:id  (edit profile)
router.patch("/:id", updateUserProfile);

export default router;
