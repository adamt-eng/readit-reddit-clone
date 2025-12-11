import Comment from "../Models/Comment.js";
import Post from "../Models/Post.js";

export const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId }).lean();

    // Build tree
    const map = {};
    const roots = [];

    comments.forEach(c => (map[c._id] = { ...c, replies: [] }));

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

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    // TEMP — replace with req.user._id when auth is added
    const userId = "67bbb24fa69019915c7fb2c4";

    const comment = await Comment.create({
      postId,
      parentId: null,
      authorId: userId,
      content
    });

    // Update post's comment count
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    res.status(201).json(comment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};
