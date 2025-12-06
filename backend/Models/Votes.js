import mongoose from "mongoose";
const { Schema } = mongoose;

const VoteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", default: null },
    commentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    value: { type: Number, enum: [1, -1], required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "votes" }
);

// Prevent duplicate votes
VoteSchema.index({ userId: 1, postId: 1 }, { unique: true, sparse: true });
VoteSchema.index({ userId: 1, commentId: 1 }, { unique: true, sparse: true });

export default mongoose.model("Vote", VoteSchema);
