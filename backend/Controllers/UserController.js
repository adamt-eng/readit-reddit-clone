import User from '../Models/User.js';

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .select('-passwordHash -__v'); // hide password + version

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // this will have: username, email, bio, avatarUrl, createdAt, karma, ...
    return res.status(200).json(user);

  } catch (error) {
    console.error("getUserById error:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
}


/* ---------------- USER SEARCH ---------------- */
export async function searchUsers(req, res) {
  try {
    let { q = "", page = 1, limit = 20 } = req.query;
    q = q.trim().toLowerCase();

    if (!q) return res.json({ results: [], total: 0 });

    const query = {
      username: { $regex: q, $options: "i" }
    };

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ results: users, total });

  } catch (err) {
    console.error("searchUsers error:", err);
    res.status(500).json({ error: "Server error while searching users" });
  }
}





