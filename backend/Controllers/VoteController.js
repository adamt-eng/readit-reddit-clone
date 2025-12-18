import mongoose from "mongoose";
import Post from "../Models/Post.js";
import Vote from "../Models/Votes.js";
import Comment from "../Models/Comment.js";
import User from "../Models/User.js";
import { createNotification } from "./NotificationController.js";

// Votes posts
export const votePost = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id: postId } = req.params;
    const { voteScore } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    if (![1, -1].includes(voteScore)) {
      return res.status(400).json({ message: "voteScore must be +1 or -1" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingVote = await Vote.findOne({ userId, postId });

    if (!existingVote) {
      await Vote.create({ userId, postId, value: voteScore });

      const inc = voteScore === 1 ? { upvoteCount: 1 } : { downvoteCount: 1 };

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $inc: inc },
        { new: true },
      );

      if (post.authorId.toString() !== userId.toString()) {
        await User.findByIdAndUpdate(post.authorId, {
          $inc: { karma: voteScore },
        });

      await createNotification({
          userId: post.authorId,
          type: voteScore === 1 ? "post_upvote" : "post_downvote",
          payload: {
            actorId: userId,
            postId,
            commentId: null,
          },
        });
      }

      return res.json({ message: "Vote added", post: updatedPost });
    }

    if (existingVote.value === voteScore) {
      await existingVote.deleteOne();

      const inc = voteScore === 1 ? { upvoteCount: -1 } : { downvoteCount: -1 };

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $inc: inc },
        { new: true },
      );

      if (post.authorId.toString() !== userId.toString()) {
        await User.findByIdAndUpdate(post.authorId, {
          $inc: { karma: -voteScore },
        });
      }

      return res.json({ message: "Vote removed", post: updatedPost });
    }

    existingVote.value = voteScore;
    await existingVote.save();

    const inc =
      voteScore === 1
        ? { upvoteCount: 1, downvoteCount: -1 }
        : { upvoteCount: -1, downvoteCount: 1 };

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: inc },
      { new: true },
    );

    if (post.authorId.toString() !== userId.toString()) {
      await User.findByIdAndUpdate(post.authorId, {
        $inc: { karma: voteScore === 1 ? 2 : -2 },
      });
    }

    res.json({ message: "Vote updated", post: updatedPost });
  } catch (err) {
    console.error("votePost error:", err);
    res.status(500).json({ message: "Failed to vote" });
  }
};

//comment vote
export const voteComment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { commentId } = req.params;
    const { voteScore } = req.body;

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

    if (!existingVote) {
      await Vote.create({ userId, commentId, value: voteScore });

      if (voteScore === 1) comment.upvoteCount += 1;
      else comment.downvoteCount += 1;

      if (comment.authorId.toString() !== userId.toString()) {
        await User.findByIdAndUpdate(comment.authorId, {
          $inc: { karma: voteScore },
        });

        await createNotification({
          userId: comment.authorId,
          type: voteScore === 1 ? "comment_upvote" : "comment_downvote",
          payload: {
            actorId: userId,
            postId: comment.postId,
            commentId: comment._id,
          },
        });
      }

      await comment.save();
      return res.json({ message: "Vote added", comment });
    }

    if (existingVote.value === voteScore) {
      await existingVote.deleteOne();

      if (voteScore === 1) comment.upvoteCount -= 1;
      else comment.downvoteCount -= 1;

      if (comment.authorId.toString() !== userId.toString()) {
        await User.findByIdAndUpdate(comment.authorId, {
          $inc: { karma: -voteScore },
        });
      }

      await comment.save();
      return res.json({ message: "Vote removed", comment });
    }

    if (existingVote.value === 1) {
      comment.upvoteCount -= 1;
      comment.downvoteCount += 1;
    } else {
      comment.downvoteCount -= 1;
      comment.upvoteCount += 1;
    }

    existingVote.value = voteScore;

    if (comment.authorId.toString() !== userId.toString()) {
      await User.findByIdAndUpdate(comment.authorId, {
        $inc: { karma: voteScore === 1 ? 2 : -2 },
      });
    }

    await existingVote.save();
    await comment.save();

    res.json({ message: "Vote updated", comment });
  } catch (err) {
    console.error("voteComment error:", err);
    res.status(500).json({ message: "Failed to vote" });
  }
};

//get users votes
export const getUserVotes = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const votes = await Vote.find(
      { userId },
      { postId: 1, commentId: 1, value: 1, _id: 0 },
    );

    const voteMap = {
      posts: {},
      comments: {},
    };

    for (const v of votes) {
      if (v.postId) {
        voteMap.posts[v.postId.toString()] = v.value;
      }
      if (v.commentId) {
        voteMap.comments[v.commentId.toString()] = v.value;
      }
    }

    res.json(voteMap);
  } catch (err) {
    console.error("getUserPostVotes error:", err);
    res.status(500).json({ message: "Failed to fetch user votes" });
  }
};