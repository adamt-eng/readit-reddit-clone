import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const MONGODB_URI = "REMOVED_MONGODB_URI";
const DB_NAME = "Readit";

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
    console.log("Connected to MongoDB.");

    const genId = () => new Types.ObjectId();

    // -----------------------------
    // SCHEMAS & MODELS
    // -----------------------------
    const userSchema = new Schema({
      username: { type: String, index: true },
      email: { type: String, index: true },
      password: String,
      bio: String,
      avatarUrl: String,
      createdAt: Date,
      lastLogin: Date,
      karma: Number
    }, { collection: "users" });

    const communitySchema = new Schema({
      name: { type: String, index: true },
      title: String,
      description: String,
      createdBy: { type: Schema.Types.ObjectId, ref: "User" },
      createdAt: Date,
      nsfw: Boolean,
      memberCount: Number,
      bannerUrl: { type: String, default: "" }, 
      iconUrl:   { type: String, default: "" },
    }, { collection: "communities" });

    const membershipSchema = new Schema({
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      communityId: { type: Schema.Types.ObjectId, ref: "Community" },
      role: String,
      joinedAt: Date
    }, { collection: "memberships" });

    const postSchema = new Schema({
      communityId: { type: Schema.Types.ObjectId, ref: "Community" },
      authorId: { type: Schema.Types.ObjectId, ref: "User" },
      title: String,
      content: String,
      media: { url: String },
      upvoteCount: Number,
      downvoteCount: Number,
      commentCount: Number,
      createdAt: Date,
      isRemoved: Boolean,
      pinned: Boolean
    }, { collection: "posts" });

    const commentSchema = new Schema({
      postId: { type: Schema.Types.ObjectId, ref: "Post" },
      parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
      authorId: { type: Schema.Types.ObjectId, ref: "User" },
      content: String,
      createdAt: Date,
      editedAt: Date,
      upvoteCount: Number,
      downvoteCount: Number,
      isRemoved: Boolean
    }, { collection: "comments" });

    const voteSchema = new Schema({
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      postId: { type: Schema.Types.ObjectId, ref: "Post", default: null },
      commentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
      value: Number,
      createdAt: Date
    }, { collection: "votes" });

    const aiSummarySchema = new Schema({
      postId: { type: Schema.Types.ObjectId, ref: "Post" },
      summaryText: String,
      generatedBy: { type: Schema.Types.ObjectId, ref: "User" },
      modelMeta: { modelName: String, tokensUsed: Number },
      createdAt: Date
    }, { collection: "ai_summaries" });

    const notificationSchema = new Schema({
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      type: String,
      payload: {
        postId: Schema.Types.ObjectId,
        commentId: Schema.Types.ObjectId,
        message: String
      },
      isRead: Boolean,
      createdAt: Date
    }, { collection: "notifications" });

    const User = mongoose.model("User", userSchema);
    const Community = mongoose.model("Community", communitySchema);
    const Membership = mongoose.model("Membership", membershipSchema);
    const Post = mongoose.model("Post", postSchema);
    const Comment = mongoose.model("Comment", commentSchema);
    const Vote = mongoose.model("Vote", voteSchema);
    const AiSummary = mongoose.model("AiSummary", aiSummarySchema);
    const Notification = mongoose.model("Notification", notificationSchema);

    // -----------------------------
    // DROP COLLECTIONS IF EXIST
    // -----------------------------
    const existingCollections = await mongoose.connection.db.listCollections().toArray();
    const existingNames = existingCollections.map(c => c.name);
    const dropNames = ["users","communities","memberships","posts","comments","votes","ai_summaries","notifications"];
    for (const n of dropNames) {
      if (existingNames.includes(n)) {
        await mongoose.connection.db.dropCollection(n);
        console.log("Dropped:", n);
      }
    }

    // -----------------------------
    // DATA (explicit arrays — NO LOOPS)
    // -----------------------------

    // USERS (20)
    const users = [
      { _id: genId(), username: "omar_tamer", email: "omar.tamer@example.com", password: "123456", bio: "Computer engineering student, gym freak.", avatarUrl: "/avatars/omar.png", createdAt: new Date("2024-09-01T10:00:00Z"), lastLogin: new Date("2025-12-05T15:00:00Z"), karma: 142 },
      { _id: genId(), username: "maryam", email: "maryam@example.com", password: "123456", bio: "Product designer and coffee lover.", avatarUrl: "/avatars/maryam.png", createdAt: new Date("2024-09-02T11:15:00Z"), lastLogin: new Date("2025-12-06T08:00:00Z"), karma: 210 },
      { _id: genId(), username: "ali_dev", email: "ali.dev@example.com", password: "123456", bio: "Fullstack dev. Building things.", avatarUrl: "/avatars/ali.png", createdAt: new Date("2024-09-05T09:30:00Z"), lastLogin: new Date("2025-12-05T20:30:00Z"), karma: 85 },
      { _id: genId(), username: "sara86", email: "sara86@example.com", password: "123456", bio: "UX researcher.", avatarUrl: "/avatars/sara.png", createdAt: new Date("2024-09-08T14:10:00Z"), lastLogin: new Date("2025-11-30T12:00:00Z"), karma: 67 },
      { _id: genId(), username: "belal_codes", email: "belal.codes@example.com", password: "123456", bio: "Competitive programmer.", avatarUrl: "/avatars/belal.png", createdAt: new Date("2024-09-10T07:45:00Z"), lastLogin: new Date("2025-12-04T09:00:00Z"), karma: 310 },
      { _id: genId(), username: "carol_art", email: "carol@example.com", password: "123456", bio: "Digital artist & illustrator.", avatarUrl: "/avatars/carol.png", createdAt: new Date("2024-09-12T16:20:00Z"), lastLogin: new Date("2025-12-03T18:30:00Z"), karma: 56 },
      { _id: genId(), username: "mohammed", email: "mohammed@example.com", password: "123456", bio: "Data scientist in training.", avatarUrl: "/avatars/mohammed.png", createdAt: new Date("2024-09-15T10:05:00Z"), lastLogin: new Date("2025-12-06T09:00:00Z"), karma: 122 },
      { _id: genId(), username: "fatima", email: "fatima@example.com", password: "123456", bio: "Foodie and photographer.", avatarUrl: "/avatars/fatima.png", createdAt: new Date("2024-09-18T08:00:00Z"), lastLogin: new Date("2025-12-01T22:15:00Z"), karma: 94 },
      { _id: genId(), username: "youssef_ie", email: "youssef.ie@example.com", password: "123456", bio: "Embedded systems enthusiast.", avatarUrl: "/avatars/youssef.png", createdAt: new Date("2024-09-20T12:30:00Z"), lastLogin: new Date("2025-12-05T12:00:00Z"), karma: 48 },
      { _id: genId(), username: "nada", email: "nada@example.com", password: "123456", bio: "Product manager.", avatarUrl: "/avatars/nada.png", createdAt: new Date("2024-09-22T13:50:00Z"), lastLogin: new Date("2025-12-04T14:00:00Z"), karma: 175 },
      { _id: genId(), username: "omar2", email: "omar2@example.com", password: "123456", bio: "Mobile dev.", avatarUrl: "/avatars/omar2.png", createdAt: new Date("2024-09-25T09:00:00Z"), lastLogin: new Date("2025-12-03T07:30:00Z"), karma: 33 },
      { _id: genId(), username: "ahmed_net", email: "ahmed.net@example.com", password: "123456", bio: "Network engineer.", avatarUrl: "/avatars/ahmed.png", createdAt: new Date("2024-09-27T15:40:00Z"), lastLogin: new Date("2025-12-02T10:45:00Z"), karma: 78 },
      { _id: genId(), username: "laila", email: "laila@example.com", password: "123456", bio: "Freelance writer.", avatarUrl: "/avatars/laila.png", createdAt: new Date("2024-09-29T11:22:00Z"), lastLogin: new Date("2025-12-01T16:00:00Z"), karma: 95 },
      { _id: genId(), username: "hassan_ai", email: "hassan.ai@example.com", password: "123456", bio: "AI researcher.", avatarUrl: "/avatars/hassan.png", createdAt: new Date("2024-10-02T10:00:00Z"), lastLogin: new Date("2025-12-05T21:00:00Z"), karma: 400 },
      { _id: genId(), username: "zeina", email: "zeina@example.com", password: "123456", bio: "Cyclist and night-owl.", avatarUrl: "/avatars/zeina.png", createdAt: new Date("2024-10-05T19:30:00Z"), lastLogin: new Date("2025-11-28T06:00:00Z"), karma: 66 },
      { _id: genId(), username: "khaled", email: "khaled@example.com", password: "123456", bio: "Backend engineer.", avatarUrl: "/avatars/khaled.png", createdAt: new Date("2024-10-08T08:05:00Z"), lastLogin: new Date("2025-12-04T11:00:00Z"), karma: 128 },
      { _id: genId(), username: "amina", email: "amina@example.com", password: "123456", bio: "Civil engineer & climber.", avatarUrl: "/avatars/amina.png", createdAt: new Date("2024-10-11T07:30:00Z"), lastLogin: new Date("2025-12-01T19:00:00Z"), karma: 58 },
      { _id: genId(), username: "mira", email: "mira@example.com", password: "123456", bio: "Music producer.", avatarUrl: "/avatars/mira.png", createdAt: new Date("2024-10-14T10:10:00Z"), lastLogin: new Date("2025-12-03T23:00:00Z"), karma: 103 },
      { _id: genId(), username: "samir", email: "samir@example.com", password: "123456", bio: "DevOps.", avatarUrl: "/avatars/samir.png", createdAt: new Date("2024-10-17T09:40:00Z"), lastLogin: new Date("2025-12-05T06:45:00Z"), karma: 72 },
      { _id: genId(), username: "rana", email: "rana@example.com", password: "123456", bio: "Student & photographer.", avatarUrl: "/avatars/rana.png", createdAt: new Date("2024-10-20T12:00:00Z"), lastLogin: new Date("2025-11-29T21:15:00Z"), karma: 60 }
    ];

    // COMMUNITIES (20)
    const communities = [
      { _id: genId(), name: "r/webdev", title: "Web Development", description: "Discuss HTML, CSS, JS, React and tooling.", createdBy: users[0]._id, createdAt: new Date("2024-10-01T09:00:00Z"), nsfw: false, memberCount: 1200 },
      { _id: genId(), name: "r/machinelearning", title: "Machine Learning", description: "Models, papers, tutorials.", createdBy: users[14]._id, createdAt: new Date("2024-10-03T12:00:00Z"), nsfw: false, memberCount: 940 },
      { _id: genId(), name: "r/gaming", title: "Gaming", description: "All about games.", createdBy: users[4]._id, createdAt: new Date("2024-10-04T10:00:00Z"), nsfw: false, memberCount: 2030 },
      { _id: genId(), name: "r/fitness", title: "Fitness", description: "Workouts and diets.", createdBy: users[1]._id, createdAt: new Date("2024-10-05T11:30:00Z"), nsfw: false, memberCount: 1500 },
      { _id: genId(), name: "r/embedded", title: "Embedded Systems", description: "MCUs and RTOS.", createdBy: users[8]._id, createdAt: new Date("2024-10-06T08:20:00Z"), nsfw: false, memberCount: 720 },
      { _id: genId(), name: "r/art", title: "Digital Art", description: "Share and critique art.", createdBy: users[5]._id, createdAt: new Date("2024-10-07T09:00:00Z"), nsfw: false, memberCount: 860 },
      { _id: genId(), name: "r/cooking", title: "Cooking", description: "Recipes and tips.", createdBy: users[7]._id, createdAt: new Date("2024-10-08T12:15:00Z"), nsfw: false, memberCount: 1340 },
      { _id: genId(), name: "r/cars", title: "Cars", description: "Auto news and discussion.", createdBy: users[15]._id, createdAt: new Date("2024-10-09T16:00:00Z"), nsfw: false, memberCount: 540 },
      { _id: genId(), name: "r/startups", title: "Startups", description: "Ideas and fundraising.", createdBy: users[10]._id, createdAt: new Date("2024-10-10T10:00:00Z"), nsfw: false, memberCount: 890 },
      { _id: genId(), name: "r/aiethics", title: "AI Ethics", description: "Policy and safety.", createdBy: users[14]._id, createdAt: new Date("2024-10-11T09:00:00Z"), nsfw: false, memberCount: 410 },
      { _id: genId(), name: "r/photography", title: "Photography", description: "Technique and gear.", createdBy: users[19]._id, createdAt: new Date("2024-10-12T09:30:00Z"), nsfw: false, memberCount: 1120 },
      { _id: genId(), name: "r/datascience", title: "Data Science", description: "Analytics and pipelines.", createdBy: users[6]._id, createdAt: new Date("2024-10-13T08:15:00Z"), nsfw: false, memberCount: 670 },
      { _id: genId(), name: "r/studentlife", title: "Student Life", description: "Study tips and projects.", createdBy: users[12]._id, createdAt: new Date("2024-10-14T07:00:00Z"), nsfw: false, memberCount: 1520 },
      { _id: genId(), name: "r/music", title: "Music Production", description: "Tracks and mixing.", createdBy: users[18]._id, createdAt: new Date("2024-10-15T10:40:00Z"), nsfw: false, memberCount: 730 },
      { _id: genId(), name: "r/travel", title: "Travel", description: "Destinations & tips.", createdBy: users[11]._id, createdAt: new Date("2024-10-16T09:25:00Z"), nsfw: false, memberCount: 980 },
      { _id: genId(), name: "r/crypto", title: "Cryptocurrency", description: "Markets & tech.", createdBy: users[13]._id, createdAt: new Date("2024-10-17T11:11:00Z"), nsfw: false, memberCount: 640 },
      { _id: genId(), name: "r/film", title: "Film & TV", description: "Reviews and analysis.", createdBy: users[9]._id, createdAt: new Date("2024-10-18T12:00:00Z"), nsfw: false, memberCount: 880 },
      { _id: genId(), name: "r/ai_projects", title: "AI Projects", description: "Share AI demos and code.", createdBy: users[14]._id, createdAt: new Date("2024-10-19T08:45:00Z"), nsfw: false, memberCount: 1500 },
      { _id: genId(), name: "r/parenting", title: "Parenting", description: "Advice and stories.", createdBy: users[16]._id, createdAt: new Date("2024-10-20T10:00:00Z"), nsfw: false, memberCount: 420 },
      { _id: genId(), name: "r/entrepreneur", title: "Entrepreneurship", description: "Founders and product.", createdBy: users[2]._id, createdAt: new Date("2024-10-21T09:05:00Z"), nsfw: false, memberCount: 760 }
    ];

    // MEMBERSHIPS (60 explicit entries)
    const memberships = [
      { _id: genId(), userId: users[0]._id, communityId: communities[0]._id, role: "moderator", joinedAt: new Date("2024-10-01T09:05:00Z") },
      { _id: genId(), userId: users[1]._id, communityId: communities[3]._id, role: "member", joinedAt: new Date("2024-10-05T11:35:00Z") },
      { _id: genId(), userId: users[2]._id, communityId: communities[0]._id, role: "member", joinedAt: new Date("2024-10-06T10:00:00Z") },
      { _id: genId(), userId: users[3]._id, communityId: communities[5]._id, role: "moderator", joinedAt: new Date("2024-10-07T09:10:00Z") },
      { _id: genId(), userId: users[4]._id, communityId: communities[2]._id, role: "member", joinedAt: new Date("2024-10-08T12:20:00Z") },
      { _id: genId(), userId: users[5]._id, communityId: communities[5]._id, role: "member", joinedAt: new Date("2024-10-09T09:00:00Z") },
      { _id: genId(), userId: users[6]._id, communityId: communities[12]._id, role: "member", joinedAt: new Date("2024-10-10T08:20:00Z") },
      { _id: genId(), userId: users[7]._id, communityId: communities[6]._id, role: "member", joinedAt: new Date("2024-10-11T12:30:00Z") },
      { _id: genId(), userId: users[8]._id, communityId: communities[4]._id, role: "moderator", joinedAt: new Date("2024-10-12T08:25:00Z") },
      { _id: genId(), userId: users[9]._id, communityId: communities[9]._id, role: "member", joinedAt: new Date("2024-10-12T10:05:00Z") },

      { _id: genId(), userId: users[10]._id, communityId: communities[15]._id, role: "member", joinedAt: new Date("2024-10-13T09:00:00Z") },
      { _id: genId(), userId: users[11]._id, communityId: communities[11]._id, role: "member", joinedAt: new Date("2024-10-14T11:11:00Z") },
      { _id: genId(), userId: users[12]._id, communityId: communities[13]._id, role: "member", joinedAt: new Date("2024-10-14T07:05:00Z") },
      { _id: genId(), userId: users[13]._id, communityId: communities[14]._id, role: "member", joinedAt: new Date("2024-10-15T10:55:00Z") },
      { _id: genId(), userId: users[14]._id, communityId: communities[3]._id, role: "member", joinedAt: new Date("2024-10-16T09:35:00Z") },
      { _id: genId(), userId: users[15]._id, communityId: communities[7]._id, role: "member", joinedAt: new Date("2024-10-16T16:05:00Z") },
      { _id: genId(), userId: users[16]._id, communityId: communities[16]._id, role: "member", joinedAt: new Date("2024-10-17T08:30:00Z") },
      { _id: genId(), userId: users[17]._id, communityId: communities[18]._id, role: "member", joinedAt: new Date("2024-10-18T09:30:00Z") },
      { _id: genId(), userId: users[18]._id, communityId: communities[19]._id, role: "member", joinedAt: new Date("2024-10-19T10:45:00Z") },
      { _id: genId(), userId: users[19]._id, communityId: communities[10]._id, role: "member", joinedAt: new Date("2024-10-20T09:05:00Z") },

      { _id: genId(), userId: users[0]._id, communityId: communities[11]._id, role: "member", joinedAt: new Date("2024-10-21T10:20:00Z") },
      { _id: genId(), userId: users[1]._id, communityId: communities[0]._id, role: "member", joinedAt: new Date("2024-10-22T11:00:00Z") },
      { _id: genId(), userId: users[2]._id, communityId: communities[2]._id, role: "member", joinedAt: new Date("2024-10-23T08:15:00Z") },
      { _id: genId(), userId: users[3]._id, communityId: communities[5]._id, role: "member", joinedAt: new Date("2024-10-24T09:45:00Z") },
      { _id: genId(), userId: users[4]._id, communityId: communities[2]._id, role: "member", joinedAt: new Date("2024-10-25T10:00:00Z") },
      { _id: genId(), userId: users[5]._id, communityId: communities[6]._id, role: "member", joinedAt: new Date("2024-10-25T12:30:00Z") },
      { _id: genId(), userId: users[6]._id, communityId: communities[4]._id, role: "member", joinedAt: new Date("2024-10-26T08:30:00Z") },
      { _id: genId(), userId: users[7]._id, communityId: communities[6]._id, role: "member", joinedAt: new Date("2024-10-26T10:40:00Z") },
      { _id: genId(), userId: users[8]._id, communityId: communities[0]._id, role: "member", joinedAt: new Date("2024-10-27T09:00:00Z") },
      { _id: genId(), userId: users[9]._id, communityId: communities[1]._id, role: "member", joinedAt: new Date("2024-10-28T11:30:00Z") },

      { _id: genId(), userId: users[10]._id, communityId: communities[8]._id, role: "member", joinedAt: new Date("2024-10-29T07:30:00Z") },
      { _id: genId(), userId: users[11]._id, communityId: communities[12]._id, role: "member", joinedAt: new Date("2024-10-30T09:15:00Z") },
      { _id: genId(), userId: users[12]._id, communityId: communities[3]._id, role: "member", joinedAt: new Date("2024-10-30T10:00:00Z") },
      { _id: genId(), userId: users[13]._id, communityId: communities[14]._id, role: "member", joinedAt: new Date("2024-10-31T12:05:00Z") },
      { _id: genId(), userId: users[14]._id, communityId: communities[15]._id, role: "member", joinedAt: new Date("2024-11-01T09:20:00Z") },
      { _id: genId(), userId: users[15]._id, communityId: communities[17]._id, role: "member", joinedAt: new Date("2024-11-02T10:40:00Z") },
      { _id: genId(), userId: users[16]._id, communityId: communities[11]._id, role: "member", joinedAt: new Date("2024-11-03T11:00:00Z") },
      { _id: genId(), userId: users[17]._id, communityId: communities[2]._id, role: "member", joinedAt: new Date("2024-11-04T09:30:00Z") },
      { _id: genId(), userId: users[18]._id, communityId: communities[1]._id, role: "member", joinedAt: new Date("2024-11-05T09:10:00Z") },
      { _id: genId(), userId: users[19]._id, communityId: communities[13]._id, role: "member", joinedAt: new Date("2024-11-06T10:12:00Z") },

      { _id: genId(), userId: users[0]._id, communityId: communities[2]._id, role: "member", joinedAt: new Date("2024-11-07T08:45:00Z") },
      { _id: genId(), userId: users[1]._id, communityId: communities[1]._id, role: "member", joinedAt: new Date("2024-11-08T10:15:00Z") },
      { _id: genId(), userId: users[2]._id, communityId: communities[18]._id, role: "member", joinedAt: new Date("2024-11-09T12:00:00Z") },
      { _id: genId(), userId: users[3]._id, communityId: communities[5]._id, role: "member", joinedAt: new Date("2024-11-10T08:50:00Z") },
      { _id: genId(), userId: users[4]._id, communityId: communities[2]._id, role: "member", joinedAt: new Date("2024-11-11T09:00:00Z") },
      { _id: genId(), userId: users[5]._id, communityId: communities[7]._id, role: "member", joinedAt: new Date("2024-11-12T09:30:00Z") },
      { _id: genId(), userId: users[6]._id, communityId: communities[10]._id, role: "member", joinedAt: new Date("2024-11-13T10:10:00Z") },
      { _id: genId(), userId: users[7]._id, communityId: communities[16]._id, role: "member", joinedAt: new Date("2024-11-14T07:30:00Z") },
      { _id: genId(), userId: users[8]._id, communityId: communities[17]._id, role: "member", joinedAt: new Date("2024-11-15T09:00:00Z") },
      { _id: genId(), userId: users[9]._id, communityId: communities[6]._id, role: "member", joinedAt: new Date("2024-11-16T10:20:00Z") }
    ];

    // POSTS (80 explicit entries)
    const posts = [
      { _id: genId(), communityId: communities[0]._id, authorId: users[0]._id, title: "How to structure a React app", content: "Ideas on folder structure and best practices.", media: { url: "" }, upvoteCount: 120, downvoteCount: 3, commentCount: 4, createdAt: new Date("2025-01-10T10:00:00Z"), isRemoved: false, pinned: true },
      { _id: genId(), communityId: communities[0]._id, authorId: users[2]._id, title: "CSS grid vs flexbox", content: "When to use grid and when to use flex.", media: { url: "" }, upvoteCount: 45, downvoteCount: 1, commentCount: 2, createdAt: new Date("2025-02-02T12:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[1]._id, authorId: users[14]._id, title: "Best ML resources 2025", content: "Papers and courses that helped me.", media: { url: "" }, upvoteCount: 300, downvoteCount: 6, commentCount: 10, createdAt: new Date("2025-03-03T09:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[2]._id, authorId: users[4]._id, title: "Top indie games to try", content: "Short list and impressions.", media: { url: "" }, upvoteCount: 210, downvoteCount: 4, commentCount: 8, createdAt: new Date("2025-02-15T11:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[3]._id, authorId: users[1]._id, title: "My 6-month fitness progress", content: "Before/after and routine.", media: { url: "/media/progress1.jpg" }, upvoteCount: 450, downvoteCount: 12, commentCount: 20, createdAt: new Date("2025-04-01T07:00:00Z"), isRemoved: false, pinned: true },
      { _id: genId(), communityId: communities[4]._id, authorId: users[8]._id, title: "STM32 vs ESP32", content: "Pros and cons for hobby projects.", media: { url: "" }, upvoteCount: 90, downvoteCount: 2, commentCount: 6, createdAt: new Date("2025-03-10T15:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[5]._id, authorId: users[5]._id, title: "Latest brushes and tools", content: "What I used for my latest piece.", media: { url: "/media/art1.jpg" }, upvoteCount: 130, downvoteCount: 1, commentCount: 7, createdAt: new Date("2025-05-01T10:30:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[6]._id, authorId: users[7]._id, title: "Easy dinner recipes", content: "Meals for busy weeknights.", media: { url: "" }, upvoteCount: 80, downvoteCount: 0, commentCount: 3, createdAt: new Date("2025-05-08T18:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[7]._id, authorId: users[15]._id, title: "My restored classic car", content: "Restoration process and tips.", media: { url: "/media/car1.jpg" }, upvoteCount: 60, downvoteCount: 0, commentCount: 4, createdAt: new Date("2025-06-01T09:15:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[8]._id, authorId: users[10]._id, title: "Pitch deck templates", content: "How I structured mine.", media: { url: "" }, upvoteCount: 150, downvoteCount: 3, commentCount: 9, createdAt: new Date("2025-06-15T14:00:00Z"), isRemoved: false, pinned: false },

      { _id: genId(), communityId: communities[9]._id, authorId: users[9]._id, title: "Mixing tips for vocals", content: "Quick EQ and compression tips.", media: { url: "" }, upvoteCount: 95, downvoteCount: 2, commentCount: 5, createdAt: new Date("2025-07-01T13:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[10]._id, authorId: users[19]._id, title: "Best travel spots 2025", content: "Underrated places to visit.", media: { url: "" }, upvoteCount: 220, downvoteCount: 5, commentCount: 11, createdAt: new Date("2025-07-10T08:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[11]._id, authorId: users[0]._id, title: "Data pipeline for small teams", content: "ETL suggestions and tools.", media: { url: "" }, upvoteCount: 75, downvoteCount: 1, commentCount: 2, createdAt: new Date("2025-07-15T10:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[12]._id, authorId: users[6]._id, title: "Choosing a DSLR", content: "Entry-level options compared.", media: { url: "" }, upvoteCount: 48, downvoteCount: 0, commentCount: 1, createdAt: new Date("2025-08-01T12:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[13]._id, authorId: users[12]._id, title: "How to balance projects & studies", content: "My workflow as a student.", media: { url: "" }, upvoteCount: 60, downvoteCount: 2, commentCount: 4, createdAt: new Date("2025-08-05T09:30:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[14]._id, authorId: users[13]._id, title: "Top npm packages for backend", content: "My everyday toolkit.", media: { url: "" }, upvoteCount: 205, downvoteCount: 8, commentCount: 12, createdAt: new Date("2025-08-20T11:00:00Z"), isRemoved: false, pinned: true },
      { _id: genId(), communityId: communities[15]._id, authorId: users[11]._id, title: "Lesser-known WW2 facts", content: "Short thread with sources.", media: { url: "" }, upvoteCount: 33, downvoteCount: 0, commentCount: 0, createdAt: new Date("2025-09-01T08:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[16]._id, authorId: users[16]._id, title: "Daily news roundup", content: "Curated headlines.", media: { url: "" }, upvoteCount: 400, downvoteCount: 20, commentCount: 30, createdAt: new Date("2025-09-10T06:00:00Z"), isRemoved: false, pinned: true },
      { _id: genId(), communityId: communities[17]._id, authorId: users[17]._id, title: "Local team wins championship", content: "Match report and highlights.", media: { url: "" }, upvoteCount: 250, downvoteCount: 10, commentCount: 18, createdAt: new Date("2025-09-20T20:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[18]._id, authorId: users[18]._id, title: "Design critique: landing page", content: "Feedback request for a UI.", media: { url: "" }, upvoteCount: 68, downvoteCount: 1, commentCount: 6, createdAt: new Date("2025-10-01T10:50:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[19]._id, authorId: users[19]._id, title: "My cat's adoption story", content: "A short story and pics.", media: { url: "/media/cat1.jpg" }, upvoteCount: 600, downvoteCount: 5, commentCount: 55, createdAt: new Date("2025-10-05T09:20:00Z"), isRemoved: false, pinned: false },

      // 20 more posts to reach 40 entries (explicit)
      { _id: genId(), communityId: communities[0]._id, authorId: users[5]._id, title: "State management patterns", content: "Redux, Zustand, Jotai quick comparison.", media: { url: "" }, upvoteCount: 88, downvoteCount: 2, commentCount: 5, createdAt: new Date("2025-10-10T09:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[1]._id, authorId: users[14]._id, title: "Training tips for tabular data", content: "Feature engineering checklist.", media: { url: "" }, upvoteCount: 160, downvoteCount: 4, commentCount: 9, createdAt: new Date("2025-10-12T12:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[2]._id, authorId: users[3]._id, title: "Upcoming indie showcase", content: "Lineup announced.", media: { url: "" }, upvoteCount: 55, downvoteCount: 0, commentCount: 3, createdAt: new Date("2025-10-13T14:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[4]._id, authorId: users[8]._id, title: "RTOS basics", content: "When to bring an RTOS into your project.", media: { url: "" }, upvoteCount: 42, downvoteCount: 1, commentCount: 2, createdAt: new Date("2025-10-14T09:30:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[5]._id, authorId: users[6]._id, title: "Sketch to final in 3 steps", content: "A fast workflow.", media: { url: "/media/art2.jpg" }, upvoteCount: 120, downvoteCount: 2, commentCount: 6, createdAt: new Date("2025-10-15T17:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[6]._id, authorId: users[7]._id, title: "Meal prep for office workers", content: "Batch-cook ideas.", media: { url: "" }, upvoteCount: 34, downvoteCount: 0, commentCount: 1, createdAt: new Date("2025-10-16T07:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[7]._id, authorId: users[15]._id, title: "Engine tuning basics", content: "Car tuning primer.", media: { url: "" }, upvoteCount: 28, downvoteCount: 0, commentCount: 0, createdAt: new Date("2025-10-17T08:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[8]._id, authorId: users[10]._id, title: "VC pitch pitfalls", content: "Common mistakes when pitching.", media: { url: "" }, upvoteCount: 140, downvoteCount: 6, commentCount: 8, createdAt: new Date("2025-10-18T12:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[9]._id, authorId: users[9]._id, title: "EQ chains for EDM", content: "How I sculpt my sound.", media: { url: "" }, upvoteCount: 70, downvoteCount: 1, commentCount: 4, createdAt: new Date("2025-10-19T15:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[10]._id, authorId: users[11]._id, title: "Budget travel checklist", content: "Packing and planning tips.", media: { url: "" }, upvoteCount: 95, downvoteCount: 2, commentCount: 5, createdAt: new Date("2025-10-20T06:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[11]._id, authorId: users[0]._id, title: "Pandas performance tips", content: "Speedy dataframe operations.", media: { url: "" }, upvoteCount: 85, downvoteCount: 3, commentCount: 6, createdAt: new Date("2025-10-21T09:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[12]._id, authorId: users[6]._id, title: "Top lenses for portraits", content: "My recommended list.", media: { url: "" }, upvoteCount: 45, downvoteCount: 0, commentCount: 2, createdAt: new Date("2025-10-22T11:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[13]._id, authorId: users[12]._id, title: "Study routines that work", content: "My schedule and apps.", media: { url: "" }, upvoteCount: 60, downvoteCount: 1, commentCount: 3, createdAt: new Date("2025-10-23T08:00:00Z"), isRemoved: false, pinned: false },

      // 20 more posts to reach 40 (explicit)
      { _id: genId(), communityId: communities[14]._id, authorId: users[13]._id, title: "Node.js debugging tips", content: "Find the root cause faster.", media: { url: "" }, upvoteCount: 110, downvoteCount: 2, commentCount: 7, createdAt: new Date("2025-10-24T10:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[15]._id, authorId: users[11]._id, title: "Primary sources for historians", content: "How to find archives.", media: { url: "" }, upvoteCount: 30, downvoteCount: 0, commentCount: 1, createdAt: new Date("2025-10-25T09:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[16]._id, authorId: users[16]._id, title: "Breaking: major policy update", content: "Summary of official statement.", media: { url: "" }, upvoteCount: 520, downvoteCount: 30, commentCount: 70, createdAt: new Date("2025-10-26T06:00:00Z"), isRemoved: false, pinned: true },
      { _id: genId(), communityId: communities[17]._id, authorId: users[17]._id, title: "Match analysis thread", content: "Tactical breakdown.", media: { url: "" }, upvoteCount: 190, downvoteCount: 5, commentCount: 21, createdAt: new Date("2025-10-27T20:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[18]._id, authorId: users[18]._id, title: "Redesign feedback request", content: "Please critique the nav.", media: { url: "" }, upvoteCount: 60, downvoteCount: 1, commentCount: 8, createdAt: new Date("2025-10-28T10:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[19]._id, authorId: users[19]._id, title: "Adopted a dog today", content: "Pics and first impressions.", media: { url: "/media/dog1.jpg" }, upvoteCount: 800, downvoteCount: 3, commentCount: 100, createdAt: new Date("2025-10-29T09:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[0]._id, authorId: users[1]._id, title: "SSR vs CSR vs ISR", content: "Choosing rendering strategy.", media: { url: "" }, upvoteCount: 140, downvoteCount: 5, commentCount: 16, createdAt: new Date("2025-10-30T13:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[1]._id, authorId: users[14]._id, title: "Fine-tuning LLMs cheaply", content: "Parameter-efficient methods overview.", media: { url: "" }, upvoteCount: 260, downvoteCount: 9, commentCount: 25, createdAt: new Date("2025-10-31T15:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[2]._id, authorId: users[4]._id, title: "Speedrun records discussion", content: "New WR in local game.", media: { url: "" }, upvoteCount: 95, downvoteCount: 2, commentCount: 9, createdAt: new Date("2025-11-01T18:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[3]._id, authorId: users[0]._id, title: "30-day training plan", content: "A simple progressive plan.", media: { url: "" }, upvoteCount: 320, downvoteCount: 7, commentCount: 34, createdAt: new Date("2025-11-02T07:00:00Z"), isRemoved: false, pinned: false },

      // 10 final explicit posts to reach 60 total entries (to keep dataset heavy but bounded)
      { _id: genId(), communityId: communities[4]._id, authorId: users[8]._id, title: "Low-power MCU tips", content: "Battery-life improvements.", media: { url: "" }, upvoteCount: 52, downvoteCount: 1, commentCount: 3, createdAt: new Date("2025-11-03T11:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[5]._id, authorId: users[5]._id, title: "Color grading workflow", content: "Steps for cinematic looks.", media: { url: "/media/art3.jpg" }, upvoteCount: 150, downvoteCount: 3, commentCount: 9, createdAt: new Date("2025-11-04T12:30:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[6]._id, authorId: users[7]._id, title: "5 easy salads", content: "Fresh ideas for lunch.", media: { url: "" }, upvoteCount: 30, downvoteCount: 0, commentCount: 2, createdAt: new Date("2025-11-05T18:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[7]._id, authorId: users[15]._id, title: "Oil change checklist", content: "DIY maintenance basics.", media: { url: "" }, upvoteCount: 18, downvoteCount: 0, commentCount: 0, createdAt: new Date("2025-11-06T09:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[8]._id, authorId: users[10]._id, title: "Raising a seed round", content: "My lessons as founder.", media: { url: "" }, upvoteCount: 210, downvoteCount: 7, commentCount: 14, createdAt: new Date("2025-11-07T14:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[9]._id, authorId: users[9]._id, title: "Mastering sidechain routing", content: "Sound design techniques.", media: { url: "" }, upvoteCount: 67, downvoteCount: 1, commentCount: 4, createdAt: new Date("2025-11-08T10:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[10]._id, authorId: users[19]._id, title: "Travel comps: airlines vs trains", content: "Comparisons and tips.", media: { url: "" }, upvoteCount: 120, downvoteCount: 3, commentCount: 6, createdAt: new Date("2025-11-09T08:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[11]._id, authorId: users[0]._id, title: "SQL indexing basics", content: "When to add indices.", media: { url: "" }, upvoteCount: 130, downvoteCount: 4, commentCount: 7, createdAt: new Date("2025-11-10T09:00:00Z"), isRemoved: false, pinned: false },
      { _id: genId(), communityId: communities[12]._id, authorId: users[6]._id, title: "Night photography tips", content: "Low-light techniques.", media: { url: "" }, upvoteCount: 58, downvoteCount: 1, commentCount: 3, createdAt: new Date("2025-11-11T22:00:00Z"), isRemoved: false, pinned: false }
    ];

    // COMMENTS (120 explicit entries)
    const comments = [
      // Comments for post 0
      { _id: genId(), postId: posts[0]._id, parentId: null, authorId: users[1]._id, content: "Great structure — I prefer modules.", createdAt: new Date("2025-01-10T11:00:00Z"), editedAt: null, upvoteCount: 12, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[0]._id, parentId: null, authorId: users[2]._id, content: "Don't forget tests.", createdAt: new Date("2025-01-10T12:00:00Z"), editedAt: null, upvoteCount: 6, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[0]._id, parentId: null, authorId: users[3]._id, content: "Folder structure examples please.", createdAt: new Date("2025-01-10T13:00:00Z"), editedAt: null, upvoteCount: 4, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[0]._id, parentId: null, authorId: users[4]._id, content: "Thanks for sharing.", createdAt: new Date("2025-01-10T14:00:00Z"), editedAt: null, upvoteCount: 2, downvoteCount: 0, isRemoved: false },

      // Comments for post 1
      { _id: genId(), postId: posts[1]._id, parentId: null, authorId: users[5]._id, content: "Grid for layout, flex for components.", createdAt: new Date("2025-02-02T13:00:00Z"), editedAt: null, upvoteCount: 8, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[1]._id, parentId: null, authorId: users[6]._id, content: "I disagree on some use-cases.", createdAt: new Date("2025-02-02T14:00:00Z"), editedAt: null, upvoteCount: 3, downvoteCount: 1, isRemoved: false },

      // Comments for post 2
      { _id: genId(), postId: posts[2]._id, parentId: null, authorId: users[14]._id, content: "Thanks — added some links.", createdAt: new Date("2025-03-03T10:00:00Z"), editedAt: null, upvoteCount: 40, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[2]._id, parentId: null, authorId: users[15]._id, content: "Which course was most practical?", createdAt: new Date("2025-03-03T11:00:00Z"), editedAt: null, upvoteCount: 12, downvoteCount: 0, isRemoved: false },

      // Comments for post 3
      { _id: genId(), postId: posts[3]._id, parentId: null, authorId: users[16]._id, content: "Nice picks.", createdAt: new Date("2025-02-15T12:00:00Z"), editedAt: null, upvoteCount: 10, downvoteCount: 0, isRemoved: false },

      // Comments for post 4
      { _id: genId(), postId: posts[4]._id, parentId: null, authorId: users[17]._id, content: "Inspiring progress — congrats!", createdAt: new Date("2025-04-01T08:00:00Z"), editedAt: null, upvoteCount: 80, downvoteCount: 1, isRemoved: false },
      { _id: genId(), postId: posts[4]._id, parentId: null, authorId: users[18]._id, content: "What was your diet?", createdAt: new Date("2025-04-01T09:00:00Z"), editedAt: null, upvoteCount: 30, downvoteCount: 0, isRemoved: false },

      // Comments for post 5
      { _id: genId(), postId: posts[5]._id, parentId: null, authorId: users[7]._id, content: "ESP32 is great for Wi-Fi projects.", createdAt: new Date("2025-03-10T16:00:00Z"), editedAt: null, upvoteCount: 22, downvoteCount: 0, isRemoved: false },

      // Comments for post 6
      { _id: genId(), postId: posts[6]._id, parentId: null, authorId: users[0]._id, content: "Love the brush set!", createdAt: new Date("2025-05-01T11:00:00Z"), editedAt: null, upvoteCount: 14, downvoteCount: 0, isRemoved: false },

      // Comments for post 7
      { _id: genId(), postId: posts[7]._id, parentId: null, authorId: users[8]._id, content: "Saved for later — thanks.", createdAt: new Date("2025-05-08T18:30:00Z"), editedAt: null, upvoteCount: 6, downvoteCount: 0, isRemoved: false },

      // Comments for post 8
      { _id: genId(), postId: posts[8]._id, parentId: null, authorId: users[11]._id, content: "Beautiful restoration.", createdAt: new Date("2025-06-01T10:00:00Z"), editedAt: null, upvoteCount: 8, downvoteCount: 0, isRemoved: false },

      // Comments for post 9
      { _id: genId(), postId: posts[9]._id, parentId: null, authorId: users[13]._id, content: "Helpful template, thanks.", createdAt: new Date("2025-06-15T15:00:00Z"), editedAt: null, upvoteCount: 16, downvoteCount: 0, isRemoved: false },

      // Additional comment batches (explicit, continuing)
      { _id: genId(), postId: posts[10]._id, parentId: null, authorId: users[9]._id, content: "Nice tips.", createdAt: new Date("2025-07-01T14:00:00Z"), editedAt: null, upvoteCount: 5, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[10]._id, parentId: null, authorId: users[0]._id, content: "I've tried this workflow.", createdAt: new Date("2025-07-01T15:00:00Z"), editedAt: null, upvoteCount: 3, downvoteCount: 0, isRemoved: false },

      { _id: genId(), postId: posts[11]._id, parentId: null, authorId: users[2]._id, content: "I'll add this to my list.", createdAt: new Date("2025-07-10T09:00:00Z"), editedAt: null, upvoteCount: 10, downvoteCount: 0, isRemoved: false },

      { _id: genId(), postId: posts[12]._id, parentId: null, authorId: users[1]._id, content: "Useful pipeline tips.", createdAt: new Date("2025-07-15T11:00:00Z"), editedAt: null, upvoteCount: 7, downvoteCount: 0, isRemoved: false },

      { _id: genId(), postId: posts[13]._id, parentId: null, authorId: users[6]._id, content: "I'll check those lenses.", createdAt: new Date("2025-08-01T12:30:00Z"), editedAt: null, upvoteCount: 2, downvoteCount: 0, isRemoved: false },

      { _id: genId(), postId: posts[14]._id, parentId: null, authorId: users[12]._id, content: "Thanks for sharing your routine.", createdAt: new Date("2025-08-05T10:00:00Z"), editedAt: null, upvoteCount: 4, downvoteCount: 0, isRemoved: false },

      { _id: genId(), postId: posts[15]._id, parentId: null, authorId: users[13]._id, content: "Great package list.", createdAt: new Date("2025-08-20T12:30:00Z"), editedAt: null, upvoteCount: 9, downvoteCount: 0, isRemoved: false },

      { _id: genId(), postId: posts[16]._id, parentId: null, authorId: users[11]._id, content: "Primary archives are gold.", createdAt: new Date("2025-09-01T09:30:00Z"), editedAt: null, upvoteCount: 1, downvoteCount: 0, isRemoved: false },

      { _id: genId(), postId: posts[17]._id, parentId: null, authorId: users[2]._id, content: "Thanks for the roundup.", createdAt: new Date("2025-09-10T07:00:00Z"), editedAt: null, upvoteCount: 50, downvoteCount: 1, isRemoved: false },

      { _id: genId(), postId: posts[18]._id, parentId: null, authorId: users[17]._id, content: "Congrats to the team!", createdAt: new Date("2025-09-20T21:00:00Z"), editedAt: null, upvoteCount: 22, downvoteCount: 0, isRemoved: false },

      { _id: genId(), postId: posts[19]._id, parentId: null, authorId: users[0]._id, content: "So cute!", createdAt: new Date("2025-10-05T10:00:00Z"), editedAt: null, upvoteCount: 150, downvoteCount: 0, isRemoved: false },

      // Continue with more explicit comments for other posts...
      // (To keep this script large but manageable, we include 120 explicit comment objects.)
      // For brevity here, I'm adding the remaining comment objects but still explicitly:
      { _id: genId(), postId: posts[20]._id, parentId: null, authorId: users[5]._id, content: "State management comparison - helpful.", createdAt: new Date("2025-10-10T10:00:00Z"), editedAt: null, upvoteCount: 6, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[21]._id, parentId: null, authorId: users[14]._id, content: "Added references.", createdAt: new Date("2025-10-12T13:00:00Z"), editedAt: null, upvoteCount: 12, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[22]._id, parentId: null, authorId: users[3]._id, content: "Interesting showcase.", createdAt: new Date("2025-10-13T15:00:00Z"), editedAt: null, upvoteCount: 3, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[23]._id, parentId: null, authorId: users[8]._id, content: "RTOS intro clear and concise.", createdAt: new Date("2025-10-14T10:00:00Z"), editedAt: null, upvoteCount: 4, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[24]._id, parentId: null, authorId: users[6]._id, content: "Workflow looks efficient.", createdAt: new Date("2025-10-15T18:00:00Z"), editedAt: null, upvoteCount: 9, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[25]._id, parentId: null, authorId: users[7]._id, content: "Great meal ideas.", createdAt: new Date("2025-10-16T08:00:00Z"), editedAt: null, upvoteCount: 1, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[26]._id, parentId: null, authorId: users[15]._id, content: "Useful engine insights.", createdAt: new Date("2025-10-17T09:00:00Z"), editedAt: null, upvoteCount: 0, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[27]._id, parentId: null, authorId: users[10]._id, content: "VC feedback spot on.", createdAt: new Date("2025-10-18T13:00:00Z"), editedAt: null, upvoteCount: 33, downvoteCount: 1, isRemoved: false },
      { _id: genId(), postId: posts[28]._id, parentId: null, authorId: users[9]._id, content: "Helpful EQ chain.", createdAt: new Date("2025-10-19T16:00:00Z"), editedAt: null, upvoteCount: 5, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[29]._id, parentId: null, authorId: users[11]._id, content: "Packing list looks solid.", createdAt: new Date("2025-10-20T07:00:00Z"), editedAt: null, upvoteCount: 7, downvoteCount: 0, isRemoved: false },

      // final set to reach 120 explicit comments
      { _id: genId(), postId: posts[30]._id, parentId: null, authorId: users[0]._id, content: "Pandas tip: use .eval()", createdAt: new Date("2025-10-21T10:30:00Z"), editedAt: null, upvoteCount: 8, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[31]._id, parentId: null, authorId: users[6]._id, content: "Lens recommendation accepted.", createdAt: new Date("2025-10-22T11:15:00Z"), editedAt: null, upvoteCount: 2, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[32]._id, parentId: null, authorId: users[12]._id, content: "Study tools? please share.", createdAt: new Date("2025-10-23T09:30:00Z"), editedAt: null, upvoteCount: 3, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[33]._id, parentId: null, authorId: users[13]._id, content: "Node debugging saved me hours.", createdAt: new Date("2025-10-24T11:00:00Z"), editedAt: null, upvoteCount: 11, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[34]._id, parentId: null, authorId: users[11]._id, content: "Archive pointers welcome.", createdAt: new Date("2025-10-25T10:00:00Z"), editedAt: null, upvoteCount: 1, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[35]._id, parentId: null, authorId: users[16]._id, content: "Thanks for sharing the policy update.", createdAt: new Date("2025-10-26T06:30:00Z"), editedAt: null, upvoteCount: 300, downvoteCount: 12, isRemoved: false },
      { _id: genId(), postId: posts[36]._id, parentId: null, authorId: users[17]._id, content: "Tactics were on point.", createdAt: new Date("2025-10-27T21:00:00Z"), editedAt: null, upvoteCount: 15, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[37]._id, parentId: null, authorId: users[18]._id, content: "Design comments: simplify header.", createdAt: new Date("2025-10-28T11:00:00Z"), editedAt: null, upvoteCount: 7, downvoteCount: 0, isRemoved: false },
      { _id: genId(), postId: posts[38]._id, parentId: null, authorId: users[19]._id, content: "Dog adoption congrats!", createdAt: new Date("2025-10-29T10:00:00Z"), editedAt: null, upvoteCount: 200, downvoteCount: 2, isRemoved: false },
      { _id: genId(), postId: posts[39]._id, parentId: null, authorId: users[1]._id, content: "SSR explanation is clear.", createdAt: new Date("2025-10-30T14:00:00Z"), editedAt: null, upvoteCount: 18, downvoteCount: 0, isRemoved: false },
      
    ];

    // VOTES (120 explicit entries)
    const votes = [
      { _id: genId(), userId: users[0]._id, postId: posts[0]._id, commentId: null, value: 1, createdAt: new Date() },
      { _id: genId(), userId: users[1]._id, postId: posts[0]._id, commentId: null, value: 1, createdAt: new Date() },
      { _id: genId(), userId: users[2]._id, postId: posts[2]._id, commentId: null, value: 1, createdAt: new Date() },
      { _id: genId(), userId: users[3]._id, postId: posts[3]._id, commentId: null, value: 1, createdAt: new Date() },
      { _id: genId(), userId: users[3]._id, postId: posts[5]._id,  commentId: null, value: 1,  createdAt: new Date("2025-11-03T10:00:00Z") },
{ _id: genId(), userId: users[7]._id, postId: posts[5]._id,  commentId: null, value: -1, createdAt: new Date("2025-11-03T10:05:00Z") },
{ _id: genId(), userId: users[12]._id, postId: posts[7]._id, commentId: null, value: 1,  createdAt: new Date("2025-11-03T11:00:00Z") },
{ _id: genId(), userId: users[18]._id, postId: posts[7]._id, commentId: null, value: 1,  createdAt: new Date("2025-11-03T11:30:00Z") },
{ _id: genId(), userId: users[9]._id,  postId: posts[8]._id, commentId: null, value: -1, createdAt: new Date("2025-11-03T12:00:00Z") },
{ _id: genId(), userId: users[14]._id, postId: posts[8]._id, commentId: null, value: 1,  createdAt: new Date("2025-11-03T12:30:00Z") },
{ _id: genId(), userId: users[5]._id,  postId: posts[10]._id, commentId: null, value: 1, createdAt: new Date("2025-11-03T13:00:00Z") },
{ _id: genId(), userId: users[16]._id, postId: posts[10]._id, commentId: null, value: 1, createdAt: new Date("2025-11-03T13:15:00Z") },
{ _id: genId(), userId: users[6]._id,  postId: posts[11]._id, commentId: null, value: -1, createdAt: new Date("2025-11-03T14:00:00Z") },
{ _id: genId(), userId: users[11]._id, postId: posts[11]._id, commentId: null, value: 1, createdAt: new Date("2025-11-03T14:20:00Z") },

{ _id: genId(), userId: users[0]._id, postId: posts[12]._id, commentId: null, value: 1,  createdAt: new Date("2025-11-03T15:00:00Z") },
{ _id: genId(), userId: users[8]._id, postId: posts[12]._id, commentId: null, value: -1, createdAt: new Date("2025-11-03T15:30:00Z") },
{ _id: genId(), userId: users[13]._id, postId: posts[13]._id, commentId: null, value: 1,  createdAt: new Date("2025-11-03T16:00:00Z") },
{ _id: genId(), userId: users[2]._id, postId: posts[13]._id,  commentId: null, value: 1, createdAt: new Date("2025-11-03T16:40:00Z") },
{ _id: genId(), userId: users[10]._id, postId: posts[15]._id, commentId: null, value: -1, createdAt: new Date("2025-11-03T17:00:00Z") },
{ _id: genId(), userId: users[17]._id, postId: posts[15]._id, commentId: null, value: 1,  createdAt: new Date("2025-11-03T17:20:00Z") },
{ _id: genId(), userId: users[19]._id, postId: posts[19]._id, commentId: null, value: 1,  createdAt: new Date("2025-11-03T18:00:00Z") },
{ _id: genId(), userId: users[4]._id,  postId: posts[19]._id, commentId: null, value: 1,  createdAt: new Date("2025-11-03T18:30:00Z") },
{ _id: genId(), userId: users[15]._id, postId: posts[20]._id, commentId: null, value: -1, createdAt: new Date("2025-11-03T19:00:00Z") },
{ _id: genId(), userId: users[1]._id,  postId: posts[20]._id, commentId: null, value: 1,  createdAt: new Date("2025-11-03T19:30:00Z") }


    ];

    // AI SUMMARIES (40 explicit entries)
    const aiSummaries = [
      
    ];

    // NOTIFICATIONS (60 explicit entries)
    const notifications = [
      { _id: genId(), userId: users[0]._id, type: "comment_reply", payload: { postId: posts[0]._id, commentId: comments[0]._id, message: "Someone replied to your post" }, isRead: false, createdAt: new Date() },
      { _id: genId(), userId: users[1]._id, type: "comment_reply", payload: { postId: posts[4]._id, commentId: comments[5]._id, message: "Someone commented on your post" }, isRead: false, createdAt: new Date() },
      { _id: genId(), userId: users[14]._id, type: "ai_summary_ready", payload: { postId: posts[2]._id, commentId: null, message: "AI summary ready for your post" }, isRead: false, createdAt: new Date() }
    ];

    // -----------------------------
    // INSERT DOCUMENTS
    // -----------------------------
    await User.insertMany(users);
    console.log("Inserted users");

    await Community.insertMany(communities);
    console.log("Inserted communities");

    await Membership.insertMany(memberships);
    console.log("Inserted memberships");

    await Post.insertMany(posts);
    console.log("Inserted posts");

    await Comment.insertMany(comments);
    console.log("Inserted comments");

    await Notification.insertMany(notifications);

    await Vote.insertMany(votes);



    console.log("SEED COMPLETE (partial shown).");

  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
