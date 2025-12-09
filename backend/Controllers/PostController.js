import Post from "../Models/Post.js";
import Community from "../Models/Community.js";

// Get all Communities for "Select Community" dropdown
export const getPostableCommunities = async (req, res) => {
  try {
    const communities = await Community.find({}, { name: 1, title: 1 });
    return res.json(communities);
  } catch (err) {
    console.error("Error fetching communities:", err);
    return res.status(500).json({ message: "Failed to load communities" });
  }
};