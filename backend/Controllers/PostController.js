import Community from "../Models/Community.js";
import Membership from "../Models/Membership.js";
import Post from "../Models/Post.js";

// Get communities where the user is a member and can post
export const getPostableCommunities = async (req, res) => {
  try {
    const { userId } = req.query; // TEMP

    if (!userId) {
      return res.status(400).json({ message: "userId missing (temporary)" });
    }

    const memberships = await Membership.find(
      { userId },
      { communityId: 1 }
    );

    const communityIds = memberships.map(m => m.communityId);

    const communities = await Community.find(
      { _id: { $in: communityIds } },
      { name: 1, title: 1 }
    );

    return res.json(communities);
  } catch (err) {
    console.error("COMMUNITY LOAD ERROR:", err);
    return res.status(500).json({ message: "Failed to load communities" });
  }
};

// Create a new post (TEMP: userId from request body)
export const createPost = async (req, res) => {
  try {
    const { userId, title, content, type, communityId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "userId missing (temporary)" });
    }

    if (!title || !communityId || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const membership = await Membership.findOne({
      userId,
      communityId
    });

    if (!membership) {
      return res.status(403).json({
        message: "You must join the community first"
      });
    }

    const post = await Post.create({
      title,
      content,
      type,
      communityId,
      authorId: userId,
      createdAt: new Date()
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
};
