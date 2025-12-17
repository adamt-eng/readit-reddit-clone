import mongoose from "mongoose";
import Community from "../Models/Community.js";
import Membership from "../Models/Membership.js";
import Post from "../Models/Post.js";
import Vote from "../Models/Votes.js";
import Comment from "../Models/Comment.js";



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
    const { title, content, type, communityId } = req.body;
    const userId = req.user.id;

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
    await User.findByIdAndUpdate(userId, {
      $inc: { karma: 1 }
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

/* ---------- GET ALL POSTS BY USER ---------- */
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




/* ---------- IMPROVED PERSONALIZED FEED ---------- */
export const getPersonalizedFeed = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { page = 1, limit = 20, sort = "best" } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    /* ============================
       BASE MATCH
    ============================ */

    let baseMatch = { isRemoved: false };

    // Logged-in users → only joined communities
    if (userId) {
      const memberships = await Membership.find({ userId }).select("communityId");
      const joinedCommunityIds = memberships.map(m => m.communityId);

      if (joinedCommunityIds.length === 0) {
        return res.json({ posts: [], hasMore: false });
      }

      baseMatch.communityId = { $in: joinedCommunityIds };
    }

    /* ============================
       USER INTERACTIONS
    ============================ */

    let interactedPostIds = [];

    if (userId) {
      const [votes, comments] = await Promise.all([
        Vote.find({ userId, postId: { $ne: null } }).select("postId"),
        Comment.find({ authorId: userId }).select("postId")
      ]);

      interactedPostIds = [
        ...new Set([
          ...votes.map(v => v.postId.toString()),
          ...comments.map(c => c.postId.toString())
        ])
      ];
    }

    /* ============================
       SORT DEFINITIONS (STABLE)
    ============================ */

    let sortStage;

    if (sort === "new") {
      sortStage = { createdAt: -1, _id: -1 };
    } else if (sort === "top") {
      sortStage = { upvoteCount: -1, createdAt: -1 };
    } else {
      // best
      // priority handled by query structure, not scores
      sortStage = { createdAt: -1, _id: -1 };
    }

    /* ============================
       PHASE 1 — NON-INTERACTED
    ============================ */

    const nonInteracted = await Post.aggregate([
      {
        $match: {
          ...baseMatch,
          ...(interactedPostIds.length
            ? { _id: { $nin: interactedPostIds.map(id => new mongoose.Types.ObjectId(id)) } }
            : {})
        }
      },
      { $sort: sortStage },
      { $skip: skip },
      { $limit: limitNum },
      { $lookup: { from: "communities", localField: "communityId", foreignField: "_id", as: "community" } },
      { $lookup: { from: "users", localField: "authorId", foreignField: "_id", as: "author" } },
      { $unwind: "$community" },
      { $unwind: "$author" }
    ]);

    let posts = nonInteracted;

    /* ============================
       PHASE 2 — FALLBACK (INTERACTED)
    ============================ */

    if (posts.length < limitNum && interactedPostIds.length) {
      const remaining = limitNum - posts.length;

      const interacted = await Post.aggregate([
        {
          $match: {
            ...baseMatch,
            _id: { $in: interactedPostIds.map(id => new mongoose.Types.ObjectId(id)) }
          }
        },
        { $sort: sortStage },
        { $skip: Math.max(0, skip - nonInteracted.length) },
        { $limit: remaining },
        { $lookup: { from: "communities", localField: "communityId", foreignField: "_id", as: "community" } },
        { $lookup: { from: "users", localField: "authorId", foreignField: "_id", as: "author" } },
        { $unwind: "$community" },
        { $unwind: "$author" }
      ]);

      posts = [...posts, ...interacted];
    }

    /* ============================
       HAS MORE (CORRECT)
    ============================ */

    const totalRemaining = await Post.countDocuments(baseMatch);
    const hasMore = skip + posts.length < totalRemaining;

    res.json({
      posts: formatPosts(posts),
      hasMore
    });

  } catch (err) {
    console.error("Personalized feed error:", err);
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


//popular
export const getPopularPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const posts = await Post.aggregate([
      {
        $match: {
          isRemoved: false
        }
      },

      /* ---------------------------
         POPULARITY SCORE
         total = upvotes + downvotes + comments
      --------------------------- */
      {
        $addFields: {
          totalEngagement: {
            $add: [
              { $ifNull: ["$upvoteCount", 0] },
              { $ifNull: ["$downvoteCount", 0] },
              { $ifNull: ["$commentCount", 0] }
            ]
          }
        }
      },

      /* ---------------------------
         SORT BY POPULARITY
      --------------------------- */
      {
        $sort: {
          totalEngagement: -1,
          createdAt: -1 // stable tie-breaker
        }
      },

      { $skip: skip },
      { $limit: limitNum },

      /* ---------------------------
         POPULATE COMMUNITY
      --------------------------- */
      {
        $lookup: {
          from: "communities",
          localField: "communityId",
          foreignField: "_id",
          as: "community"
        }
      },

      /* ---------------------------
         POPULATE AUTHOR
      --------------------------- */
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

    res.json({
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
        type: p.media?.url ? "image" : "text"
      })),
      hasMore: posts.length === limitNum
    });

  } catch (err) {
    console.error("getPopularPosts error:", err);
    res.status(500).json({ message: "Failed to load popular posts" });
  }
};


//get user's post for profile
export async function getUserPosts(req, res) {
  try {
    const userId = req.params.id; 

    const posts = await Post.find({ authorId: userId, isRemoved: false })
      .populate("communityId", "name")
      .populate("authorId", "username avatarUrl")
      .sort({ createdAt: -1 });

    // Format matches the "formatted" logic in your searchPosts
    const results = posts.map((p) => ({
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

    // Returning the array directly as requested
    res.json(results);
  } catch (err) {
    console.error("getUserPosts error:", err);
    res.status(500).json({ error: "Server error fetching posts" });
  }
}

//delete post
export const deletePost = async (req, res) => {
  try {
    const userId = req.user?.id;
    const  postId  = req.params.id;
    console.log("id is ",postId);
    

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only author can delete
    if (post.authorId.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed to delete this post" });
    }


    // Get all comment IDs under the post
    const comments = await Comment.find(
      { postId },
      { _id: 1 }
    );

    const commentIds = comments.map(c => c._id);

    // 2Delete votes on comments
    if (commentIds.length > 0) {
      await Vote.deleteMany({
        commentId: { $in: commentIds }
      });
    }

    // Delete votes on the post
    await Vote.deleteMany({ postId });

    // Delete all comments under the post
    await Comment.deleteMany({ postId });

    // Delete the post itself
    await Post.deleteOne({ _id: postId });

    return res.json({ message: "Post and all related data deleted successfully" });

  } catch (err) {
    console.error("deletePost error:", err);
    return res.status(500).json({ message: "Failed to delete post" });
  }
};
