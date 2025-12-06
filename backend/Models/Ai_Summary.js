import mongoose from "mongoose";
const { Schema } = mongoose;

const AiSummarySchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    summaryText: { type: String, required: true },
    generatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modelMeta: {
      modelName: { type: String },
      tokensUsed: { type: Number }
    },
    createdAt: { type: Date, default: Date.now }
  },
  { collection: "ai_summaries" }
);

export default mongoose.model("AiSummary", AiSummarySchema);
