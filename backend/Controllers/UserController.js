import mongoose from "mongoose";
import User from "../Models/User.js";
import Post from "../Models/Post.js";
import Membership from "../Models/Membership.js";
import bcrypt from "bcryptjs";

import { createNotification } from "./NotificationController.js";

// Get user profile by id
export const getUserById = async (req, res) => {
  try {
    console.log('viewing profile')
    // raw id from URL, may contain spaces or \n from copy-paste
    const rawId = req.params.id || "";
    const userId = rawId.trim();

    // if id is not a valid ObjectId => return 400, not CastError
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format", rawId });
    }

    const user = await User.findById(userId).select(
      "-password -passwordHash -__v -savedPosts",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await createNotification({
      userId: req.params.id,
      type: "profile_view",
      payload: {
        actorId: req.user.id,
        postId: null,
        commentId: null,
      },
    });
    return res.status(200).json(user);
  } catch (error) {
    console.error("getUserById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get my profile
export const getProfile = async (req, res) => {
  try {
    const userId = (req.user?.id || "").trim();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ message: "Invalid user ID format", rawId: userId });
    }

    const user = await User.findById(userId).select("-password -__v");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Search user
export const searchUsers = async (req, res) => {
  try {
    let { q = "", page = 1, limit = 20 } = req.query;
    q = q.trim().toLowerCase();
    page = Number(page);
    limit = Number(limit);

    if (!q) return res.json({ results: [], total: 0 });

    const query = {
      username: { $regex: q, $options: "i" },
    };

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password -passwordHash -__v") // hide password hash
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
        .json({
          message: "No valid fields to update (username/bio/avatarUrl)",
        });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true },
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

// Update profile
export const updateMyProfile = async (req, res) => {
  try {
    const userId = (req.user?.id || "").trim();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ message: "Invalid user ID format", rawId: userId });
    }

    const { username, bio, avatarUrl } = req.body;

    const updates = {};
    if (typeof username === "string" && username.trim() !== "")
      updates.username = username.trim();
    if (typeof bio === "string") updates.bio = bio;
    if (typeof avatarUrl === "string") updates.avatarUrl = avatarUrl;

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({
          message: "No valid fields to update (username/bio/avatarUrl)",
        });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password -passwordHash -__v");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("updateMyProfile error:", error);

    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Username or email already in use" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

// Get user stats
export const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;

    // fetch counts in parallel
    const [postsCount, communitiesCount, user] = await Promise.all([
      Post.countDocuments({ authorId: userId, isRemoved: false }),
      Membership.countDocuments({ userId }),
      User.findById(userId).select("karma createdAt"),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format age
    const createdAt = new Date(user.createdAt);
    const now = new Date();

    const diffMs = now - createdAt;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    let age;
    if (years > 0) age = `${years}y`;
    else if (months > 0) age = `${months}mo`;
    else age = `${days}d`;

    res.json({
      postsCount,
      communitiesCount,
      karma: user.karma || 0,
      age,
    });
  } catch (err) {
    console.error("getUserStats error:", err);
    res.status(500).json({ message: "Failed to load user stats" });
  }
};

export const changeMyPassword = async (req, res) => {
  try {
    const userId = (req.user?.id || "").trim();
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "oldPassword and newPassword are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok)
      return res.status(401).json({ message: "Old password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("changeMyPassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};