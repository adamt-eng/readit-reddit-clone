// Controllers/UserController.js
import mongoose from "mongoose";
import User from '../Models/User.js';
import { createNotification } from "./NotificationController.js";

// ----------------------------------------
// GET USER BY ID  -->  GET /users/:id
// ----------------------------------------
export const getUserById = async (req, res) => {
  try {
    // raw id from URL, may contain spaces or \n from copy-paste
    const rawId = req.params.id || "";
    const userId = rawId.trim();

    // if id is not a valid ObjectId => return 400, not CastError
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ message: "Invalid user ID format", rawId });
    }

    const user = await User.findById(userId).select("-password -passwordHash -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

createNotification({
  userId: "69345c85481669617584618c",
  type: "profile_view",
  payload: {
    actorId: "69345c854816696175846190", 
    postId: null,
    commentId: null,
  }
});
    return res.status(200).json(user);
  } catch (error) {
    console.error("getUserById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
//get my profile
// ----------------------------------------
// GET USER BY ID  -->  GET /users/:id
// ----------------------------------------
export const getProfile = async (req, res) => {
  try {
    const userId = (req.user?.id || "").trim();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format", rawId: userId });
    }

    const user = await User.findById(userId).select("-password -passwordHash -__v");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------------
// SEARCH USERS  -->  GET /users/search?q=...
// ----------------------------------------
export const searchUsers = async (req, res) => {
  try {
    let { q = "", page = 1, limit = 20 } = req.query;
    q = q.trim().toLowerCase();
    page = Number(page);
    limit = Number(limit);

    if (!q) return res.json({ results: [], total: 0 });

    const query = {
      username: { $regex: q, $options: "i" }
    };

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password -passwordHash -__v")   // hide password hash
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({ results: users, total });
  } catch (err) {
    console.error("searchUsers error:", err);
    return res
      .status(500)
      .json({ error: "Server error while searching users" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const rawId = req.params.id || "";
    const userId = rawId.trim();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const { username, bio, avatarUrl } = req.body;

    // Build the fields we allow to update
    const updates = {};
    if (typeof username === "string" && username.trim() !== "") {
      updates.username = username.trim();
    }
    if (typeof bio === "string") {
      updates.bio = bio;
    }
    if (typeof avatarUrl === "string") {
      updates.avatarUrl = avatarUrl;
    }

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields to update (username/bio/avatarUrl)" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password -passwordHash -__v");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("updateUserProfile error:", error);

    // handle duplicate username/email
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Username or email already in use" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------------
// UPDATE MY PROFILE  -->  PATCH /users/me
// Requires auth middleware (sets req.user.id)
// ----------------------------------------
export const updateMyProfile = async (req, res) => {
  try {
    const userId = (req.user?.id || "").trim();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format", rawId: userId });
    }

    const { username, bio, avatarUrl } = req.body;

    const updates = {};
    if (typeof username === "string" && username.trim() !== "") updates.username = username.trim();
    if (typeof bio === "string") updates.bio = bio;
    if (typeof avatarUrl === "string") updates.avatarUrl = avatarUrl;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update (username/bio/avatarUrl)" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password -passwordHash -__v");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("updateMyProfile error:", error);

    if (error.code === 11000) {
      return res.status(409).json({ message: "Username or email already in use" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};



