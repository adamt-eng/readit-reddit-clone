import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../Models/User.js";
import dotenv from "dotenv";
dotenv.config();

// Helper for JWT creation
const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ------------------ SIGNUP ------------------
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check email
    const existingUserName = await User.findOne({ username });
    if (existingUserName)
      return res.status(400).json({ message: "Username already in use" });

    // Check email
    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ message: "Email already in use" });

    // Check username
    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ message: "Username already taken" });

    const hashed = await bcrypt.hash(password, process.env.HASHING);

    const user = await User.create({
      username,
      email,
      password: hashed,
      bio: "",
      avatarUrl: "",
      createdAt: new Date(),
      lastLogin: new Date(),
      karma: 0
    });

    const token = createToken({ id: user._id });
    console.log(token)
    res.cookie("auth", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 100
    });

    user.password = undefined;

    res.status(200).json({ message: "User created", user });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ------------------ LOGIN (Auto-hash un-hashed passwords) ------------------
export const login = async (req, res) => {
  console.log(req.body);
  
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    console.log(user);
    console.log(user.password);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // ------------------ CHECK IF PASSWORD IS HASHED ------------------
    let isHashed = false;

    if (typeof user.password === "string") {
      isHashed =
        user.password.startsWith("$2a$") ||
        user.password.startsWith("$2b$") ||
        user.password.startsWith("$2y$");
    }
    console.log(user.password);
    
    // If password in DB is NOT hashed → hash it and save it
    if (!isHashed) {
      console.log("⚠️ Plaintext password detected. Auto-hashing now...");

      if (!user.password) {
        return res.status(500).json({
          message: "User password is missing in the database."
        });
      }

      // Hash old plaintext password
      const hashed = await bcrypt.hash(user.password, process.env.HASHING);
      user.password = hashed;
      await user.save();
    }
    // ---------------------------------------------------------------

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid password" });

    const token = createToken({ id: user._id });
 
    res.cookie("auth", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 100
    });

    user.password = undefined;

    res.status(200).json({ message: "Logged in", user });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ------------------ LOGOUT ------------------
export const logout = (req, res) => {
  res.clearCookie("auth");
  res.json({ message: "Logged out" });
};
