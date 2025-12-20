import mongoose from "mongoose";
import Community from "../Models/Community.js";
import Membership from "../Models/Membership.js";
import Post from "../Models/Post.js";
import Vote from "../Models/Votes.js";
import Comment from "../Models/Comment.js";
import User from "../Models/User.js";
import Notification from "../Models/Notification.js";
// Get communities where the user is a member and can post
export const getPostableCommunities = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const memberships = await Membership.find({ userId }, { communityId: 1 });

    const communityIds = memberships.map((m) => m.communityId);

    const communities = await Community.find(
      { _id: { $in: communityIds } },
      { name: 1, title: 1, iconUrl: 1 },
    );

    return res.json(communities);
  } catch (err) {
    console.error("COMMUNITY LOAD ERROR:", err);
    return res.status(500).json({ message: "Failed to load communities" });
  }
};

// GET POSTS BY COMMUNITY
export const getPostsByCommunity = async (req, res) => {
  try {
    const { name } = req.params;

    const community = await Community.findOne({ name: name.toLowerCase() });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const posts = await Post.find({ communityId: community._id })
      .populate("authorId", "username avatarUrl")
      .sort({ createdAt: -1 });

    const results = posts.map((p) => ({
      _id: p._id,
      title: p.title,
      content: p.content,
      image: p.media?.url || null,
      community: community.name,
      communityIcon: community.iconUrl || null,
      user: p.authorId?.username || "",
      userAvatar: p.authorId?.avatarUrl || "",
      upvotes: p.upvoteCount || 0,
      downvotes: p.downvoteCount || 0,
      comments: p.commentCount || 0,
      createdAt: p.createdAt,
      type: p.media?.url ? "image" : "text",
    }));

    res.json(results);
  } catch (err) {
    console.error("getPostsByCommunity error:", err);
    res.status(500).json({ message: "Failed to load community posts" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, type, communityId } = req.body;
    const userId = req.user.id;

    if (!title || !communityId || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const membership = await Membership.findOne({
      userId,
      communityId,
    });

    if (!membership) {
      return res.status(403).json({
        message: "You must join the community first",
      });
    }

    const post = await Post.create({
      title,
      content,
      type,
      communityId,
      authorId: userId,
      createdAt: new Date(),
    });
    await User.findByIdAndUpdate(userId, {
      $inc: { karma: 1 },
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export async function searchPosts(req, res) {
  try {
    let {
      q = "",
      page = 1,
      limit = 20,
      sort = "relevance",
      time = "all",
    } = req.query;

    q = q.trim().toLowerCase();
    page = Number(page);
    limit = Number(limit);

    if (!q) return res.json({ results: [], total: 0 });

    let timeFilter = {};
    const now = new Date();

    if (time === "24h") {
      timeFilter = { createdAt: { $gte: new Date(now - 24 * 60 * 60 * 1000) } };
    } else if (time === "7d") {
      timeFilter = {
        createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) },
      };
    } else if (time === "30d") {
      timeFilter = {
        createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) },
      };
    }

    const query = {
      ...timeFilter,
      $or: [{ title: { $regex: q, $options: "i" } }],
    };

    let sortOption = {};
    if (sort === "newest") sortOption = { createdAt: -1 };
    else if (sort === "oldest") sortOption = { createdAt: 1 };

    const total = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .populate("communityId", "name iconUrl")
      .populate("authorId", "username avatarUrl")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const formatted = posts.map((p) => ({
      _id: p._id,
      title: p.title,
      content: p.content,

      communityName: p.communityId?.name || "",
      iconUrl:
        p.communityId?.iconUrl || null,

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


/* GET ALL POSTS BY USER */
export const getPostsByUser = async (req, res) => {
  try {
    // raw id from URL may contain spaces/newlines
    const rawId = req.params.userId || "";
    const userId = rawId.trim();

    // validate ObjectId first
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format", rawId });
    }

    const posts = await Post.find({ authorId: userId })
      .sort({ createdAt: -1 }) // newest first
      .populate("communityId", "name title")
      .select("-__v");

    return res.status(200).json(posts);
  } catch (err) {
    console.error("getPostsByUser error:", err);
    return res.status(500).json({ message: "Failed to load user posts" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("authorId", "username avatar")
      .populate("communityId", "name iconUrl");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let userVote = 0;
    let canEdit = false; // ✅ DECLARED HERE

    if (req.user?.id) {
      const userId = req.user.id;

      // Get vote
      const voteDoc = await Vote.findOne({ userId, postId }).select("value -_id");
      userVote = voteDoc?.value ?? 0;

      // Check ownership
      canEdit = post.authorId._id.toString() === userId;
    }

    res.json({
      ...post.toObject(),
      userVote,
      canEdit, // ✅ NOW DEFINED
    });
  } catch (err) {
    console.error("Error fetching post", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* PERSONALIZED FEED */
export const getPersonalizedFeed = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 20, sort = "best" } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const userObjectId = new mongoose.Types.ObjectId(userId);


    const memberships = await Membership.find({
      userId: userObjectId,
    }).select("communityId");

    const membershipCount = memberships.length;

    if (!membershipCount) {
      return res.json({
        posts: [],
        hasMore: false,
        membershipCount: 0,
      });
    }

    const communityIds = memberships.map(m => m.communityId);

    let pipeline = [
      {
        $match: {
          isRemoved: false,
          communityId: { $in: communityIds },
        },
      },
    ];


    if (sort === "top") {
      pipeline.push(
        {
          $addFields: {
            score: {
              $add: [
                { $subtract: ["$upvoteCount", "$downvoteCount"] },
                "$commentCount",
              ],
            },
          },
        },
        { $sort: { score: -1, createdAt: -1 } }
      );
    }

    if (sort === "new") {
      pipeline.push({ $sort: { createdAt: -1, _id: -1 } });
    }


    pipeline.push(
      {
        $lookup: {
          from: "communities",
          localField: "communityId",
          foreignField: "_id",
          as: "community",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$community" },
      { $unwind: "$author" },

      { $skip: skip },
      { $limit: limitNum }
    );

    let posts = await Post.aggregate(pipeline);

    if (sort === "best") {
      posts = posts.sort(() => Math.random() - 0.5);
    }

    const totalCount = await Post.countDocuments({
      isRemoved: false,
      communityId: { $in: communityIds },
    });

    const hasMore = skip + posts.length < totalCount;

    res.json({
      posts: formatPosts(posts),
      hasMore,
      membershipCount,
    });
  } catch (err) {
    console.error("User feed error:", err);
    res.status(500).json({ message: "Failed to load user feed" });
  }
};


export const getGuestFeed = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = "best" } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    let pipeline = [
      { $match: { isRemoved: false } },
    ];


    if (sort === "top") {
      pipeline.push(
        {
          $addFields: {
            score: {
              $add: [
                { $subtract: ["$upvoteCount", "$downvoteCount"] },
                "$commentCount",
              ],
            },
          },
        },
        { $sort: { score: -1, createdAt: -1 } }
      );
    }

    if (sort === "new") {
      pipeline.push({ $sort: { createdAt: -1, _id: -1 } });
    }


    pipeline.push(
      {
        $lookup: {
          from: "communities",
          localField: "communityId",
          foreignField: "_id",
          as: "community",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$community" },
      { $unwind: "$author" },

      { $skip: skip },
      { $limit: limitNum }
    );

    let posts = await Post.aggregate(pipeline);


    if (sort === "best") {
      posts = posts.sort(() => Math.random() - 0.5);
    }

    const totalCount = await Post.countDocuments({ isRemoved: false });
    const hasMore = skip + posts.length < totalCount;

    res.json({
      posts: formatPosts(posts),
      hasMore,
    });
  } catch (err) {
    console.error("Guest feed error:", err);
    res.status(500).json({ message: "Failed to load guest feed" });
  }
};





/* FORMATTER */
function formatPosts(posts) {
  return posts.map((p) => ({
    _id: p._id,
    title: p.title,
    content: p.content,
    media: p.media,
    community: p.community.name,
    communityTitle: p.community.title,
    communityIcon: p.community.iconUrl || null,
    user: p.author.username,
    userAvatar: p.author.avatarUrl,
    upvotes: p.upvoteCount || 0,
    downvotes: p.downvoteCount || 0,
    comments: p.commentCount || 0,
    createdAt: p.createdAt,
    type: p.media?.url ? "image" : "text",
  }));
}

// Popular
export const getPopularPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    const limitPlusOne = limitNum + 1;

    const posts = await Post.aggregate([
      {
        $match: {
          isRemoved: false,
        },
      },
      {
        $addFields: {
          totalEngagement: {
            $add: [
              { $ifNull: ["$upvoteCount", 0] },
              {
                $multiply: [{ $ifNull: ["$downvoteCount", 0] }, -1],
              },
              { $ifNull: ["$commentCount", 0] },
            ],
          },
        },
      },
      {
        $sort: {
          totalEngagement: -1,
          createdAt: -1,
        },
      },
      { $skip: skip },
      { $limit: limitPlusOne },
      {
        $lookup: {
          from: "communities",
          localField: "communityId",
          foreignField: "_id",
          as: "community",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$community",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    const hasMore = posts.length > limitNum;
    const finalPosts = hasMore ? posts.slice(0, limitNum) : posts;

    res.json({
      posts: finalPosts.map((p) => ({
        _id: p._id,
        title: p.title,
        content: p.content,
        media: p.media,
        community: p.community?.name || null,
        communityTitle: p.community?.title || null,
        user: p.author?.username || null,
        userAvatar: p.author?.avatarUrl || null,
        upvotes: p.upvoteCount || 0,
        downvotes: p.downvoteCount || 0,
        comments: p.commentCount || 0,
        createdAt: p.createdAt,
        type: p.media?.url ? "image" : "text",
      })),
      hasMore,
    });
  } catch (err) {
    console.error("getPopularPosts error:", err);
    res.status(500).json({ message: "Failed to load popular posts" });
  }
};

// Get user's post for profile
export async function getUserPosts(req, res) {
  try {
    const userId = req.params.id;

    const posts = await Post.find({
      authorId: userId,
      isRemoved: false,
    })
      .populate("communityId", "name iconUrl")
      .populate("authorId", "username avatarUrl")
      .sort({ createdAt: -1 });

    const results = posts.map((p) => ({
      _id: p._id,
      title: p.title,
      content: p.content,

      communityName: p.communityId?.name || "",
      iconUrl:
        p.communityId?.iconUrl || null,

      author: p.authorId?.username || "",
      avatarUrl: p.authorId?.avatarUrl || "",

      upvoteCount: p.upvoteCount,
      commentCount: p.commentCount,
      createdAt: p.createdAt,
    }));

    res.json(results);
  } catch (err) {
    console.error("getUserPosts error:", err);
    res.status(500).json({ error: "Server error fetching posts" });
  }
}


// Delete post
export const deletePost = async (req, res) => {
  try {
    const userId = req.user?.id;
    const postId = req.params.id;
    console.log("Post ID is ", postId);

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only author can delete
    if (post.authorId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this post" });
    }

    // Get all comment IDs under the post
    const comments = await Comment.find({ postId }, { _id: 1 });

    const commentIds = comments.map((c) => c._id);

    // Delete votes on comments
    if (commentIds.length > 0) {
      await Vote.deleteMany({
        commentId: { $in: commentIds },
      });
    }

    // Delete votes on the post
    await Vote.deleteMany({ postId });

    // Delete all comments under the post
    await Comment.deleteMany({ postId });

    //delete related notis
    await Notification.deleteMany({
      $or: [
        { "payload.postId": postId },
        { "payload.commentId": { $in: commentIds } },
      ],
    });


    // Delete the post itself
    await Post.deleteOne({ _id: postId });

    return res.json({
      message: "Post and all related data deleted successfully",
    });
  } catch (err) {
    console.error("deletePost error:", err);
    return res.status(500).json({ message: "Failed to delete post" });
  }
};

// Edit post
export const editPost = async (req, res) => {
  try {
    const userId = req.user?.id;
    const postId = req.params.id;
    const { title, content, removeImage } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed to edit this post" });
    }

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;

    if (removeImage && post.media) {
      post.media = null;
    }

    await post.save();

    return res.json(post);
  } catch (err) {
    console.error("editPost error:", err);
    return res.status(500).json({ message: "Failed to edit post" });
  }
};

//save post
export const savePost = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { postId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.savedPosts.includes(postId)) {
      return res.status(200).json({ message: "Post already saved" });
    }

    user.savedPosts.push(postId);
    await user.save();

    res.status(200).json({ message: "Post saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


//remove save
export const unsavePost = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { postId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const wasSaved = user.savedPosts.some(
      (id) => id.toString() === postId
    );

    if (!wasSaved) {
      return res.status(200).json({ message: "Post not in saved list" });
    }

    user.savedPosts = user.savedPosts.filter(
      (id) => id.toString() !== postId
    );

    await user.save();

    res.status(200).json({ message: "Post removed from saved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//get user saved for profile
export async function getSavedPosts(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await User.findById(userId).select("savedPosts");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({
      _id: { $in: user.savedPosts },
      isRemoved: false,
    })
      .populate("communityId", "name iconUrl")
      .populate("authorId", "username avatarUrl")
      .sort({ createdAt: -1 });

    const results = posts.map((p) => ({
      _id: p._id,
      title: p.title,
      content: p.content,

      communityName: p.communityId?.name || "",
      iconUrl: p.communityId?.iconUrl || null,

      author: p.authorId?.username || "",
      avatarUrl: p.authorId?.avatarUrl || "",

      upvoteCount: p.upvoteCount,
      commentCount: p.commentCount,
      createdAt: p.createdAt,
    }));

    res.json(results);
  } catch (err) {
    console.error("getSavedPosts error:", err);
    res.status(500).json({ error: "Server error fetching saved posts" });
  }
}