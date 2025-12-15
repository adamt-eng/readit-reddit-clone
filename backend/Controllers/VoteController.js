import Post from "../Models/Post.js";
import Vote from "../Models/Votes.js";
import Comment from "../Models/Comment.js";

export const votePost = async (req, res) => {
  try {
    const userId = req.user?.id;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    const { id: postId } = req.params;
    const { voteScore } = req.body; // +1 or -1

    /* ---------- VALIDATION ---------- */

=======
    const postId = req.params.id;
    const { value } = req.body;

>>>>>>> Stashed changes
=======
    const postId = req.params.id;
    const { value } = req.body;

>>>>>>> Stashed changes
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (![1, -1].includes(value)) {
      return res.status(400).json({ message: "Invalid vote value" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
    /* ---------- FIND EXISTING VOTE ---------- */

    const existingVote = await Vote.findOne({ userId, postId });

    /* ---------- CASE 1: NO PREVIOUS VOTE ---------- */

=======
    const existingVote = await Vote.findOne({ userId, postId });

    // ---------- NO PREVIOUS VOTE ----------
>>>>>>> Stashed changes
=======
    const existingVote = await Vote.findOne({ userId, postId });

    // ---------- NO PREVIOUS VOTE ----------
>>>>>>> Stashed changes
    if (!existingVote) {
      await Vote.create({
        userId,
        postId,
<<<<<<< Updated upstream
<<<<<<< Updated upstream

    
        value: voteScore,
=======
        commentId: null,
        value,
        createdAt: new Date()
>>>>>>> Stashed changes
=======
        commentId: null,
        value,
        createdAt: new Date()
>>>>>>> Stashed changes
      });

      if (value === 1) post.upvoteCount += 1;
      else post.downvoteCount += 1;

      await post.save();
      return res.json({ post });
    }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
    /* ---------- CASE 2: SAME VOTE → REMOVE ---------- */

    if (existingVote.value === voteScore) {
=======
    // ---------- SAME VOTE (REMOVE) ----------
    if (existingVote.value === value) {
>>>>>>> Stashed changes
=======
    // ---------- SAME VOTE (REMOVE) ----------
    if (existingVote.value === value) {
>>>>>>> Stashed changes
      await existingVote.deleteOne();

      if (value === 1) post.upvoteCount -= 1;
      else post.downvoteCount -= 1;

      post.upvoteCount = Math.max(0, post.upvoteCount);
      post.downvoteCount = Math.max(0, post.downvoteCount);

      await post.save();
      return res.json({ post });
    }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
    /* ---------- CASE 3: CHANGE VOTE ---------- */

=======
    // ---------- CHANGE VOTE ----------
>>>>>>> Stashed changes
=======
    // ---------- CHANGE VOTE ----------
>>>>>>> Stashed changes
    if (existingVote.value === 1) {
      post.upvoteCount -= 1;
      post.downvoteCount += 1;
    } else {
      post.downvoteCount -= 1;
      post.upvoteCount += 1;
    }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
   
    existingVote.value = voteScore;

=======
=======
>>>>>>> Stashed changes
    post.upvoteCount = Math.max(0, post.upvoteCount);
    post.downvoteCount = Math.max(0, post.downvoteCount);

    existingVote.value = value;
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    await existingVote.save();
    await post.save();

    res.json({ post });
  } catch (err) {
    console.error("votePost error:", err);
    res.status(500).json({ message: "Failed to vote" });
  }
};

<<<<<<< Updated upstream
<<<<<<< Updated upstream
export const voteComment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { commentId } = req.params;
    const { voteScore } = req.body; // +1 or -1

    /* ---------- VALIDATION ---------- */

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    if (![1, -1].includes(voteScore)) {
      return res.status(400).json({ message: "Invalid voteScore" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const existingVote = await Vote.findOne({ userId, commentId });

    /* ---------- CASE 1: NO PREVIOUS VOTE ---------- */

    if (!existingVote) {
      await Vote.create({
        userId,
        commentId,
        value: voteScore
      });

      if (voteScore === 1) comment.upvoteCount += 1;
      else comment.downvoteCount += 1;

      await comment.save();
      return res.json({ message: "Vote added", comment });
    }

    /* ---------- CASE 2: SAME VOTE → REMOVE ---------- */

    if (existingVote.value === voteScore) {
      await existingVote.deleteOne();

      if (voteScore === 1) comment.upvoteCount -= 1;
      else comment.downvoteCount -= 1;

      await comment.save();
      return res.json({ message: "Vote removed", comment });
    }

    /* ---------- CASE 3: SWITCH VOTE ---------- */

    if (existingVote.value === 1) {
      comment.upvoteCount -= 1;
      comment.downvoteCount += 1;
    } else {
      comment.downvoteCount -= 1;
      comment.upvoteCount += 1;
    }

    existingVote.value = voteScore;
    await existingVote.save();
    await comment.save();

    res.json({ message: "Vote updated", comment });
  } catch (err) {
    console.error("voteComment error:", err);
    res.status(500).json({ message: "Failed to vote" });
  }
};

=======
=======
>>>>>>> Stashed changes
/* ---------- GET MY VOTES ---------- */
export const getMyVotes = async (req, res) => {
  try {
    const userId = req.user.id;

    const votes = await Vote.find(
      { userId, postId: { $ne: null } },
      { postId: 1, value: 1 }
    );

    const map = {};
    votes.forEach((v) => {
      map[v.postId.toString()] = v.value;
    });

    res.json(map);
  } catch (err) {
    console.error("getMyVotes error:", err);
    res.status(500).json({ message: "Failed to fetch votes" });
  }
};
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
