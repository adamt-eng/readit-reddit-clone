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



// Helper function to calculate hours since creation
const hoursSinceCreation = (createdAt) => {
  return (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
};

/* ---------- PERSONALIZED FEED ALGORITHM ---------- */
export const getPersonalizedFeed = async (req, res) => {
  try {
    let userId = req.user?.id
    const { page = 1, limit = 20, sort = "best" } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // If no userId (guest), return random posts
    if (!userId) {
      const randomPosts = await Post.find({ isRemoved: false })
        .populate("communityId", "name title iconUrl")
        .populate("authorId", "username avatarUrl")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      // Shuffle for randomness
      const shuffled = randomPosts.sort(() => Math.random() - 0.5);

      const formatted = shuffled.map((p) => {
        // Infer post type from content
        let postType = "text";
        if (p.media?.url) {
          postType = "image";
        }
        
        return {
          _id: p._id,
          title: p.title,
          content: p.content,
          media: p.media,
          community: p.communityId?.name || "",
          communityTitle: p.communityId?.title || "",
          user: p.authorId?.username || "",
          userAvatar: p.authorId?.avatarUrl || "",
          upvotes: p.upvoteCount,
          downvotes: p.downvoteCount,
          comments: p.commentCount,
          createdAt: p.createdAt,
          type: postType,
        };
      });

      return res.json({ posts: formatted, total: formatted.length });
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Get user's joined communities
    const memberships = await Membership.find({ userId }).select("communityId");
    const joinedCommunityIds = memberships.map((m) => m.communityId);

    // Get user's voting history to understand interests
    const userVotes = await Vote.find({ userId, postId: { $ne: null } })
      .populate("postId", "communityId")
      .limit(100); // Limit to recent votes for performance

    // Extract communities from voted posts (user's interests)
    const interestedCommunityIds = [
      ...new Set(
        userVotes
          .map((v) => v.postId?.communityId)
          .filter((id) => id && !joinedCommunityIds.some((j) => j.equals(id)))
      ),
    ];

    // Get all posts (excluding removed ones)
    let allPosts = await Post.find({ isRemoved: false })
      .populate("communityId", "name title iconUrl")
      .populate("authorId", "username avatarUrl")
      .lean();

    // Calculate personalized scores for each post
    const postsWithScores = allPosts.map((post) => {
      let score = 0;
      const postCommunityId = post.communityId?._id?.toString();

      // High priority: Posts from joined communities (+100 points)
      if (
        postCommunityId &&
        joinedCommunityIds.some((id) => id.toString() === postCommunityId)
      ) {
        score += 100;
      }

      // Medium priority: Posts from communities user has voted in (+50 points)
      if (
        postCommunityId &&
        interestedCommunityIds.some((id) => id?.toString() === postCommunityId)
      ) {
        score += 50;
      }

      // Engagement score: Based on upvotes and comments (normalized)
      const engagementScore =
        (post.upvoteCount || 0) * 0.1 + (post.commentCount || 0) * 0.5;
      score += engagementScore;

      // Recency score: Newer posts get slight boost
      const hoursSince = hoursSinceCreation(post.createdAt);
      const recencyScore = Math.max(0, 10 - hoursSince * 0.5);
      score += recencyScore;

      return { ...post, personalizedScore: score };
    });

    // Sort by personalized score (descending)
    postsWithScores.sort((a, b) => b.personalizedScore - a.personalizedScore);

    // If user is new (no communities joined, no votes), shuffle top posts for variety
    if (joinedCommunityIds.length === 0 && userVotes.length === 0) {
      // Take top 50 posts and shuffle them for randomness
      const topPosts = postsWithScores.slice(0, 50);
      const shuffled = topPosts.sort(() => Math.random() - 0.5);
      postsWithScores.splice(0, 50, ...shuffled);
    }

    // Apply sorting if specified
    if (sort === "new") {
      postsWithScores.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sort === "top") {
      postsWithScores.sort((a, b) => b.upvoteCount - a.upvoteCount);
    } else if (sort === "hot") {
      // Hot = combination of upvotes and recency
      postsWithScores.sort((a, b) => {
        const hotScoreA =
          (a.upvoteCount || 0) / Math.max(1, hoursSinceCreation(a.createdAt));
        const hotScoreB =
          (b.upvoteCount || 0) / Math.max(1, hoursSinceCreation(b.createdAt));
        return hotScoreB - hotScoreA;
      });
    }
    // "best" uses personalized score (already sorted)

    // Paginate
    const paginatedPosts = postsWithScores.slice(skip, skip + limitNum);

    // Format response
    const formatted = paginatedPosts.map((p) => {
      // Infer post type from content
      let postType = "text";
      if (p.media?.url) {
        postType = "image"; // Could be image or video, but defaulting to image
      }
      
      return {
        _id: p._id,
        title: p.title,
        content: p.content,
        media: p.media,
        community: p.communityId?.name || "",
        communityTitle: p.communityId?.title || "",
        user: p.authorId?.username || "",
        userAvatar: p.authorId?.avatarUrl || "",
        upvotes: p.upvoteCount || 0,
        downvotes: p.downvoteCount || 0,
        comments: p.commentCount || 0,
        createdAt: p.createdAt,
        type: postType,
      };
    });

    res.json({
      posts: formatted,
      total: postsWithScores.length,
      hasMore: skip + limitNum < postsWithScores.length,
    });
  } catch (err) {
    console.error("getPersonalizedFeed error:", err);
    res.status(500).json({ message: "Failed to load personalized feed" });
  }
};
