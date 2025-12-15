import mongoose from "mongoose";
import Community from "../Models/Community.js";
import Membership from "../Models/Membership.js";
import Post from "../Models/Post.js";
import Vote from "../Models/Votes.js";


// Get communities where the user is a member and can post
export const getPostableCommunities = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
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
    const userId = req.user.id;         
    const { title, content, type, communityId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!title || !communityId || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check membership
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

    return res.status(201).json(post);

  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    return res.status(500).json({ message: "Failed to create post" });
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



// Helper function to calculate hours since creation
const hoursSinceCreation = (createdAt) => {
  return (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
};

/* ---------- PERSONALIZED FEED ---------- */
export const getPersonalizedFeed = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { page = 1, limit = 20, sort = "best" } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    const now = new Date();

    /* =======================
       GUEST FEED
    ======================= */
    if (!userId) {
      const posts = await Post.aggregate([
        { $match: { isRemoved: false } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNum },

        {
          $lookup: {
            from: "communities",
            localField: "communityId",
            foreignField: "_id",
            as: "community"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "author"
          }
        },
        { $unwind: "$community" },
        { $unwind: "$author" }
      ]);

      return res.json({
        posts: posts.map(p => ({
          _id: p._id,
          title: p.title,
          content: p.content,
          media: p.media,
          community: p.community.name,
          communityTitle: p.community.title,
          user: p.author.username,
          userAvatar: p.author.avatarUrl,
          upvotes: p.upvoteCount || 0,
          downvotes: p.downvoteCount || 0,
          comments: p.commentCount || 0,
          createdAt: p.createdAt,
          type: p.media?.url ? "image" : "text",
          userVote: 0
        })),
        hasMore: posts.length === limitNum
      });
    }

    /* =======================
       USER DATA
    ======================= */
    const memberships = await Membership.find({ userId }).select("communityId");
    const joinedCommunityIds = memberships.map(m => m.communityId);

    const posts = await Post.aggregate([
      { $match: { isRemoved: false } },

      {
        $addFields: {
          baseScore: {
            $cond: [{ $in: ["$communityId", joinedCommunityIds] }, 100, 0]
          }
        }
      },

      {
        $addFields: {
          engagementScore: {
            $add: [
              { $multiply: ["$upvoteCount", 0.1] },
              { $multiply: ["$commentCount", 0.5] }
            ]
          },
          hoursSince: {
            $divide: [{ $subtract: [now, "$createdAt"] }, 3600000]
          }
        }
      },

      {
        $addFields: {
          personalizedScore: {
            $add: ["$baseScore", "$engagementScore"]
          },
          hotScore: {
            $divide: [
              { $add: ["$engagementScore", "$baseScore", 1] },
              { $add: ["$hoursSince", 2] }
            ]
          }
        }
      }
    ]);

    /* =======================
       SORTING
    ======================= */
    if (sort === "new") posts.sort((a, b) => b.createdAt - a.createdAt);
    else if (sort === "top") posts.sort((a, b) => b.upvoteCount - a.upvoteCount);
    else if (sort === "hot") posts.sort((a, b) => b.hotScore - a.hotScore);
    else posts.sort((a, b) => b.personalizedScore - a.personalizedScore);

    const paginated = posts.slice(skip, skip + limitNum);

    /* =======================
       USER VOTES (CRITICAL)
    ======================= */
    const votes = await Vote.find({
      userId,
      postId: { $in: paginated.map(p => p._id) }
    });

    const voteMap = {};
    votes.forEach(v => {
      voteMap[v.postId.toString()] = v.value;
    });

    /* =======================
       POPULATE + FORMAT
    ======================= */
    const populated = await Post.populate(paginated, [
      { path: "communityId", select: "name title" },
      { path: "authorId", select: "username avatarUrl" }
    ]);

    res.json({
      posts: populated.map(p => ({
        _id: p._id,
        title: p.title,
        content: p.content,
        media: p.media,
        community: p.communityId.name,
        communityTitle: p.communityId.title,
        user: p.authorId.username,
        userAvatar: p.authorId.avatarUrl,
        upvotes: p.upvoteCount || 0,
        downvotes: p.downvoteCount || 0,
        comments: p.commentCount || 0,
        createdAt: p.createdAt,
        type: p.media?.url ? "image" : "text",
        userVote: voteMap[p._id.toString()] || 0
      })),
      hasMore: skip + limitNum < posts.length
    });

  } catch (err) {
    console.error("Feed error:", err);
    res.status(500).json({ message: "Failed to load feed" });
  }
};


/* ---------- FORMATTER ---------- */
function formatPosts(posts) {
  return posts.map(p => ({
    _id: p._id,
    title: p.title,
    content: p.content,
    media: p.media,
    community: p.community.name,
    communityTitle: p.community.title,
    user: p.author.username,
    userAvatar: p.author.avatarUrl,
    upvotes: p.upvoteCount || 0,
    downvotes: p.downvoteCount || 0,
    comments: p.commentCount || 0,
    createdAt: p.createdAt,
    type: p.media?.url ? "image" : "text"
  }));
}
