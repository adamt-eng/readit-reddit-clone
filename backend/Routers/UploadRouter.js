// backend/Routers/UploadRouter.js
import express from "express";
import multer from "multer";
import path from "path";

// 1) Configure how and where files are saved
const storage = multer.diskStorage({
  // save in backend/uploads/avatars
  destination: function (req, file, cb) {
    cb(null, "uploads/avatars");
  },
  // give each file a unique name
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // .png/.jpg...
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

const upload = multer({ storage });

const router = express.Router();

// 2) Route: POST /upload/avatar
// expects the file in field name "avatar"
router.post("/avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // This is the URL you will store in user.avatarUrl
  const avatarUrl = `/uploads/avatars/${req.file.filename}`;

  return res.status(200).json({ avatarUrl });
});

export default router;
