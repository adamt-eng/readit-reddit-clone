import mongoose from "mongoose";
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


/* ---------------- POST SEARCH ---------------- */
export async function searchPosts(req, res) {
  try {
    let { q = "", page = 1, limit = 20, sort = "relevance", time = "all" } = req.query;
    q = q.trim().toLowerCase();
    page = Number(page);
    limit = Number(limit);

    if (!q) return res.json({ results: [], total: 0 });

    // --- TIME FILTER ---
    let timeFilter = {};
    const now = new Date();

    if (time === "24h") {
      timeFilter = { createdAt: { $gte: new Date(now - 24 * 60 * 60 * 1000) } };
    } else if (time === "7d") {
      timeFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
    } else if (time === "30d") {
      timeFilter = { createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
    }

    // --- SEARCH QUERY ---
    const query = {
      ...timeFilter,
      $or: [
        { title: { $regex: q, $options: "i" } },     // priority
      ]
    };

    // --- SORT ---
    let sortOption = {};
    if (sort === "newest") sortOption = { createdAt: -1 };
    else if (sort === "oldest") sortOption = { createdAt: 1 };
    else sortOption = {}; // relevance default (Mongo handles regex match quality)

    const total = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .populate("communityId", "name")
      .populate("authorId", "username avatarUrl")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const formatted = posts.map((p) => ({
      _id: p._id,
      title: p.title,
      content: p.content,
      communityName: p.communityId?.name || "",
      author: p.authorId?.username || "",
      avatarUrl: p.authorId?.avatarUrl || "",
      upvoteCount: p.upvoteCount,
      commentCount: p.commentCount,
      createdAt: p.createdAt,
    }));

    res.json({ results: formatted, total });

  } catch (err) {
    console.error("searchPosts error:", err);
    res.status(500).json({ error: "Server error while searching posts" });
  }
}

/* ---------- GET ALL POSTS BY USER (for profile) ---------- */
export const getPostsByUser = async (req, res) => {
  try {
    // raw id from URL may contain spaces/newlines
    const rawId = req.params.userId || "";
    const userId = rawId.trim();

    // validate ObjectId first
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ message: "Invalid user ID format", rawId });
    }

    const posts = await Post.find({ authorId: userId })
      .sort({ createdAt: -1 })              // newest first
      .populate("communityId", "name title")
      .select("-__v");

    return res.status(200).json(posts);
  } catch (err) {
    console.error("getPostsByUser error:", err);
    return res
      .status(500)
      .json({ message: "Failed to load user posts" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("authorId", "username avatar")
      .populate("communityId", "name");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error("Error fetching post", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const upvotePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Optionally: verify post exists (you can add later)

    const updated = await Post.findByIdAndUpdate(
      postId,
      { $inc: { upvoteCount: 1 } },
      { new: true } // return updated post
    );

    if (!updated) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error upvoting post:", err);
    res.status(500).json({ message: "Server error" });
  }
};