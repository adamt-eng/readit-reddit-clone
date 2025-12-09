import Community from "../Models/Community.js";
import Post from "../Models/Post.js"; // only if you need posts

// ----------------------------------------------------
// CREATE COMMUNITY
// ----------------------------------------------------
export const createCommunity = async (req, res) => {
  try {
    const { name, title, description, bannerUrl, iconUrl, nsfw } = req.body || {};

    if (!name || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Community.findOne({ name: name.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Community name already exists" });
    }

    const community = new Community({
      name: name.toLowerCase(),
      title: title || name,
      description,
      createdBy: "000000000000000000000000", // TEMPORARY
      createdAt: new Date(),
      nsfw: nsfw || false,
      memberCount: 1,
      bannerUrl: bannerUrl || "",
      iconUrl: iconUrl || "",
    });

    const saved = await community.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------------------------
// GET COMMUNITY BY NAME
// /communities/:name
// ----------------------------------------------------
export const getCommunityByName = async (req, res) => {
  try {
    const { name } = req.params;

    const community = await Community.findOne({ name: name.toLowerCase() });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    return res.json(community);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------------------------
// DELETE COMMUNITY
// /communities/:name
// ----------------------------------------------------
export const deleteCommunity = async (req, res) => {
  try {
    const { name } = req.params;

    const deleted = await Community.findOneAndDelete({
      name: name.toLowerCase(),
    });

    if (!deleted) {
      return res.status(404).json({ message: "Community not found" });
    }

    return res.json({ message: "Community deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
