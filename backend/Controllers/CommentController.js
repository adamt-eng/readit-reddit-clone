import Comment from "../Models/Comment.js";

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
