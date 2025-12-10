import User from '../Models/User.js';

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password'); // Exclude password field
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);

    
}


/* ---------------- USER SEARCH ---------------- */
export async function searchUsers(req, res) {
  console.log("henaaa 3")

  try {
    const q = req.query.q?.trim().toLowerCase() || "";

    if (!q) return res.json([]);

    const users = await User.find({
      username: { $regex: q, $options: "i" }   // case-insensitive match
    })
      .select("username avatarUrl bio createdAt karma")
      .limit(20);

    res.json(users);
  } catch (err) {
    console.error("searchUsers error:", err);
    res.status(500).json({ error: "Server error while searching users" });
  }
}




