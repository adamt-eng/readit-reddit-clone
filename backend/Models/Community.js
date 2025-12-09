import mongoose from "mongoose";
const { Schema } = mongoose;

const CommunitySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true },   // r/community
    title: { type: String, required: true },
    description: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    nsfw: { type: Boolean, default: false },
    memberCount: { type: Number, default: 0 },
    bannerUrl: { type: String, default: "" }, 
    iconUrl:   { type: String, default: "" },

  },
  { collection: "communities" }
);

export default mongoose.model("Community", CommunitySchema);
