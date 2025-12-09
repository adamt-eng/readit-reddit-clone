import Community from "../Models/Community.js";
import Membership from "../Models/Membership.js";

export const getPostableCommunities = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = req.user.id;

    const memberships = await Membership.find(
      { userId },
      { communityId: 1 }
    );

    const communityIds = memberships.map(m => m.communityId);

    const communities = await Community.find(
      { _id: { $in: communityIds } },
      { name: 1, title: 1 }
    );

    return res.json(communities);
  } catch (err) {
    console.error("COMMUNITY LOAD ERROR:", err);
    return res.status(500).json({ message: "Failed to load communities" });
  }
};
