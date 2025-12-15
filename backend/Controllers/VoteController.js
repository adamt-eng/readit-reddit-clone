import mongoose from "mongoose";
import Post from "../Models/Post.js";
import Vote from "../Models/Votes.js";

export const votePost = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { postId } = req.params;
    const { voteScore } = req.body; // +1 or -1

    // ---------- VALIDATION ----------
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    if (![1, -1].includes(voteScore)) {
      return res
        .status(400)
        .json({ message: "voteScore must be +1 or -1" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ---------- FIND EXISTING VOTE ----------
    const existingVote = await Vote.findOne({ userId, postId });

    // ---------- CASE 1: NO PREVIOUS VOTE ----------
    if (!existingVote) {
      await Vote.create({
        userId,
        postId,
        voteScore,
      });

      if (voteScore === 1) post.upvoteCount += 1;
      else post.downvoteCount += 1;

      await post.save();

      return res.json({ message: "Vote added", post });
    }

    // ---------- CASE 2: SAME VOTE → REMOVE (UNVOTE) ----------
    if (existingVote.voteScore === voteScore) {
      await existingVote.deleteOne();

      if (voteScore === 1) post.upvoteCount -= 1;
      else post.downvoteCount -= 1;

      await post.save();

      return res.json({ message: "Vote removed", post });
    }

    // ---------- CASE 3: CHANGE VOTE ----------
    if (existingVote.voteScore === 1) {
      post.upvoteCount -= 1;
      post.downvoteCount += 1;
    } else {
      post.downvoteCount -= 1;
      post.upvoteCount += 1;
    }

    existingVote.voteScore = voteScore;
    await existingVote.save();
    await post.save();

    res.json({ message: "Vote updated", post });
  } catch (err) {
    console.error("votePost error:", err);
    res.status(500).json({ message: "Failed to vote" });
  }
};
