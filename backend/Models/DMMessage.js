import mongoose from "mongoose";
const { Schema } = mongoose;

const DmMessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "DmConversation",
      required: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "dm_messages" }
);

DmMessageSchema.index({ conversationId: 1, createdAt: 1 });

export default mongoose.model("DmMessage", DmMessageSchema);
