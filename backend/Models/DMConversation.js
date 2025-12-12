import mongoose from "mongoose";
const { Schema } = mongoose;

const DmConversationSchema = new Schema(
  {
    userA: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userB: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "dm_conversations" }
);

DmConversationSchema.index({ userA: 1, userB: 1 }, { unique: true });

export default mongoose.model("DmConversation", DmConversationSchema);
