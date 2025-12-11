import mongoose from "mongoose";
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true }, // "comment_reply", "mod_message", etc.
    payload: {
      actorId : { type: Schema.Types.ObjectId, ref: "Post" },
      postId: { type: Schema.Types.ObjectId, ref: "Post" },
      commentId: { type: Schema.Types.ObjectId, ref: "Comment" },
      message: { type: String }
    },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "notifications" }
);

export default mongoose.model("Notification", NotificationSchema);
