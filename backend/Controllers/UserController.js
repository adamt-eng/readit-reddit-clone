// Controllers/UserController.js
import mongoose from "mongoose";
import User from '../Models/User.js';

// ----------------------------------------
// GET USER BY ID  -->  GET /users/:id
// ----------------------------------------
export const getUserById = async (req, res) => {
  try {
    // raw id from URL, may contain spaces or \n from copy-paste
    const rawId = req.params.id || "";
    const userId = rawId.trim();   // <-- remove \n, spaces

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

    return res.status(200).json(user);
  } catch (error) {
    console.error("getUserById error:", error);
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
