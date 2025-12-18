import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Post from "../Models/Post.js";

const router = express.Router();

// Ensure folders exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Multer storage with dynamic destination
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "uploads";

    if (file.fieldname === "avatar") {
      uploadPath = "uploads/avatars";
    } else if (file.fieldname === "postImage") {
      uploadPath = "uploads/posts";
    }

    ensureDir(uploadPath);
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

const upload = multer({ storage });

// Router to upload avatar images
router.post("/avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  return res.status(200).json({ avatarUrl });
});

// Router to upload post images
router.post("/post-image", upload.single("postImage"), async (req, res) => {
  try {
    const { postId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!postId) {
      return res.status(400).json({ message: "postId is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const imageUrl = `/uploads/posts/${req.file.filename}`;
    post.media = { url: imageUrl };
    await post.save();

    return res.status(200).json({
      message: "Post image uploaded successfully",
      imageUrl,
    });
  } catch (err) {
    console.error("Post image upload error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// COMMUNITY BANNER + ICON UPLOAD (Edit Community)
const communityStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "banner") {
      cb(null, "uploads/community/banners");
    } else if (file.fieldname === "icon") {
      cb(null, "uploads/community/icons");
    } else {
      cb(new Error("Invalid upload field"), null);
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

const uploadCommunity = multer({ storage: communityStorage });

router.post(
  "/community/banner",
  uploadCommunity.single("banner"),
  (req, res) => {
    if (!req.file)
      return res.status(400).json({ message: "No banner uploaded" });

    const bannerUrl = `/uploads/community/banners/${req.file.filename}`;
    return res.status(200).json({ bannerUrl });
  },
);

router.post("/community/icon", uploadCommunity.single("icon"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No icon uploaded" });

  const iconUrl = `/uploads/community/icons/${req.file.filename}`;
  return res.status(200).json({ iconUrl });
});

export default router;
