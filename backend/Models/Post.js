import mongoose from "mongoose";
const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    communityId: { type: Schema.Types.ObjectId, ref: "Community", required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: {
      type: String,
      required: function () {
        return this.type === "text";
      },
  },

    media: {
      url: { type: String, default: "" }
    },
    upvoteCount: { type: Number, default: 0 },
    downvoteCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    isRemoved: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false }
  },
  { collection: "posts" }
);

export default mongoose.model("Post", PostSchema);
