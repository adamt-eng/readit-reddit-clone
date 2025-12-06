import mongoose from "mongoose";
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    editedAt: { type: Date, default: null },
    upvoteCount: { type: Number, default: 0 },
    downvoteCount: { type: Number, default: 0 },
    isRemoved: { type: Boolean, default: false }
  },
  { collection: "comments" }
);

export default mongoose.model("Comment", CommentSchema);
