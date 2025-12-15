import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    karma: { type: Number, default: 0 },
    contributions:{type: Number,default:0}
  },
  { collection: "users" }
);

export default mongoose.model("User", UserSchema);
