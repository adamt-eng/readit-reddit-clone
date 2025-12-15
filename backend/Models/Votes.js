import mongoose from "mongoose";
const { Schema } = mongoose;

const VoteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    commentId: { type: Schema.Types.ObjectId, ref: "Comment"},
    value: { type: Number, enum: [1, -1], required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "votes" }
);

// One vote per user per post
VoteSchema.index(
  { userId: 1, postId: 1 },
  {
    unique: true,
    partialFilterExpression: { postId: { $exists: true } }
  }
);

// One vote per user per comment (includes replies)
VoteSchema.index(
  { userId: 1, commentId: 1 },
  {
    unique: true,
    partialFilterExpression: { commentId: { $exists: true } }
  }
);


export default mongoose.model("Vote", VoteSchema);
