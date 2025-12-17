import Comment from "../Models/Comment.js";
import Post from "../Models/Post.js";
import Vote from "../Models/Votes.js";


/* ---------------- GET COMMENTS ---------------- */

export const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .populate("authorId", "username")
      .lean();

    // Build tree
    const map = {};
    const roots = [];

    comments.forEach(c => {
      map[c._id] = {
        ...c,
        author: c.authorId.username,
        replies: []
      };
    });

    comments.forEach(c => {
      if (c.parentId) {
        map[c.parentId]?.replies.push(map[c._id]);
      } else {
        roots.push(map[c._id]);
      }
    });

    res.json(roots);
  } catch (err) {
    console.error("Error fetching comments", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- CREATE COMMENT ---------------- */

export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    // logged-in user
    const userId = req.user.id;

    const comment = await Comment.create({
      postId,
      parentId: null,
      authorId: userId,
      content,
      upvoteCount: 0,
      downvoteCount: 0,
      isRemoved: false,
      createdAt: new Date()
    });

    await comment.populate("authorId", "username");

    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    res.status(201).json({
      _id: comment._id,
      content: comment.content,
      createdAt: comment.createdAt,
      authorId: comment.authorId // { _id, username }
    });
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- REPLY TO COMMENT ---------------- */

export const replyToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const parent = await Comment.findById(commentId);
    if (!parent) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const userId = req.user.id;

    const reply = await Comment.create({
      postId: parent.postId,
      parentId: commentId,
      authorId: userId,
      content,
      upvoteCount: 0,
      downvoteCount: 0,
      isRemoved: false,
      createdAt: new Date()
    });

    await reply.populate("authorId", "username");

    await Post.findByIdAndUpdate(parent.postId, {
      $inc: { commentCount: 1 }
    });

    res.status(201).json({
      _id: reply._id,
      content: reply.content,
      createdAt: reply.createdAt,
      authorId: reply.authorId
    });
  } catch (err) {
    console.error("Error replying to comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};


//get user comments for profile
export const getUserComments = async (req, res) => {
  try {
    const userId = req.user.id;

    const comments = await Comment.find({
      authorId: userId,
      isRemoved: false
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "postId",
        populate: {
          path: "communityId",
          select: "name"
        }
      });

    const results = comments.map(c => ({
      _id: c._id,
      content: c.content,
      postId: c.postId?._id,
      communityName: c.postId?.communityId?.name || "",
      createdAt: c.createdAt
    }));

    res.json(results);
  } catch (err) {
    console.error("getUserComments error:", err);
    res.status(500).json({ message: "Failed to load comments" });
  }
};


//delete a comment
export const deleteComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    const rootComment = await Comment.findById(commentId);
    if (!rootComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // only author can delete
    if (rootComment.authorId.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed to delete this comment" });
    }

    const allComments = [rootComment._id];
    const queue = [rootComment._id];

    while (queue.length) {
      const parentId = queue.shift();

      const replies = await Comment.find(
        { parentId },
        { _id: 1 }
      );

      for (const r of replies) {
        allComments.push(r._id);
        queue.push(r._id);
      }
    }

    await Vote.deleteMany({
      commentId: { $in: allComments }
    });

    await Comment.deleteMany({
      _id: { $in: allComments }
    });

    res.json({ message: "Comment and all replies deleted successfully" });

  } catch (err) {
    console.error("deleteComment error:", err);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};


