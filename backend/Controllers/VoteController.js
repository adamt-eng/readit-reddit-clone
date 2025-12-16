import mongoose from "mongoose";
import Post from "../Models/Post.js";
import Vote from "../Models/Votes.js";
import Comment from "../Models/Comment.js";
import { createNotification } from "./NotificationController.js";


export const votePost = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id: postId } = req.params;
    const { voteScore } = req.body;

    //validations
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

    /*search existing votes */

    const existingVote = await Vote.findOne({ userId, postId });


    if (!existingVote) {
      await Vote.create({
        userId,
        postId,

        value: voteScore,
      });

      if (voteScore === 1) post.upvoteCount += 1;
      else post.downvoteCount += 1;

      await post.save();

      //create noti
      console.log("idsss",post.authorId, userId)
    if ( post.authorId.toString() !== userId.toString()) {
    await createNotification({
      userId: post.authorId,
      type: voteScore === 1? "post_upvote":"post_downvote",
      payload: {
        actorId: userId,
        postId: post._id,
        commentId: null,
      },
    });
    }
      return res.json({ message: "Vote added", post });
    }


    if (existingVote.value === voteScore) {
      await existingVote.deleteOne();

      if (voteScore === 1) post.upvoteCount -= 1;
      else post.downvoteCount -= 1;

      await post.save();

      return res.json({ message: "Vote removed", post });
    }


    if (existingVote.value === 1) {
      post.upvoteCount -= 1;
      post.downvoteCount += 1;
    } else {
      post.downvoteCount -= 1;
      post.upvoteCount += 1;
    }

   
    existingVote.value = voteScore;

    await existingVote.save();
    await post.save();

    res.json({ message: "Vote updated", post });
  } catch (err) {
    console.error("votePost error:", err);
    res.status(500).json({ message: "Failed to vote" });
  }
};

export const voteComment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { commentId } = req.params;
    const { voteScore } = req.body; // +1 or -1


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
      await Vote.create({
        userId,
        commentId,
        value: voteScore
      });

      if (voteScore === 1) comment.upvoteCount += 1;
      else comment.downvoteCount += 1;

      await comment.save();

      //create noti
       if (comment.authorId.toString() !== comment.toString()) {
      await createNotification({
          userId: comment.authorId,
          type: voteScore === 1 ? "comment_upvote":"comment_downvote",
          payload: {
            actorId: userId,
            postId: comment.postId,
            commentId: comment._id,
          },
        });
      }

      return res.json({ message: "Vote added", comment });
    }


    if (existingVote.value === voteScore) {
      await existingVote.deleteOne();

      if (voteScore === 1) comment.upvoteCount -= 1;
      else comment.downvoteCount -= 1;

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
    await existingVote.save();
    await comment.save();

    res.json({ message: "Vote updated", comment });
  } catch (err) {
    console.error("voteComment error:", err);
    res.status(500).json({ message: "Failed to vote" });
  }
};

//get user votes
export const getUserPostVotes = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Get only post votes 
    const votes = await Vote.find(
      {
        userId,
        postId: { $ne: null }
      },
      { postId: 1, value: 1, _id: 0 }
    );

    // Convert to map: { postId: value }
    const voteMap = {};
    for (const v of votes) {
      voteMap[v.postId.toString()] = v.value;
    }

    res.json(voteMap);
  } catch (err) {
    console.error("getUserPostVotes error:", err);
    res.status(500).json({ message: "Failed to fetch user votes" });
  }
};
