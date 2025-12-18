import Community from "../Models/Community.js";
import Membership from "../Models/Membership.js";
import Post from "../Models/Post.js";

// CREATE COMMUNITY
export const createCommunity = async (req, res) => {
  try {
    const { name, title, description, bannerUrl, iconUrl, nsfw } =
      req.body || {};

    if (!name || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Community.findOne({ name: name.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Community name already exists" });
    }

    const community = new Community({
      name: name.toLowerCase(),
      title: title || name,
      description,
      createdBy: req.user.id,
      createdAt: new Date(),
      nsfw: nsfw || false,
      memberCount: 1,
      bannerUrl: bannerUrl || "",
      iconUrl: iconUrl || "",
    });

    const saved = await community.save();
    await Membership.create({
      userId: req.user.id,
      communityId: saved._id,
      role: "moderator",
      joinedAt: new Date(),
    });

    return res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET COMMUNITY BY NAME
export const getCommunityByName = async (req, res) => {
  try {
    const { name } = req.params;

    const community = await Community.findOne({ name: name.toLowerCase() });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    return res.json(community);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE COMMUNITY
export const deleteCommunity = async (req, res) => {
  try {
    // must be logged in (auth middleware should set req.user.id)
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { name } = req.params;

    // find the community first
    const community = await Community.findOne({ name: name.toLowerCase() });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // check membership for THIS community
    const membership = await Membership.findOne({
      userId: req.user.id,
      communityId: community._id,
    });

    if (!membership || membership.role !== "moderator") {
      return res
        .status(403)
        .json({ message: "Only moderators can delete this community" });
    }

    // only moderators can delete
    if (membership.role !== "moderator") {
      return res
        .status(403)
        .json({ message: "Only moderators can delete this community" });
    }

    await Membership.deleteMany({ communityId: community._id });
    await Post.deleteMany({ communityId: community._id });

    await Community.deleteOne({ _id: community._id });

    return res.json({ message: "Community deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Join Community
export const joinCommunity = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const community = await Community.findOne({
      name: req.params.name.toLowerCase(),
    });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const exists = await Membership.findOne({
      userId: req.user.id,
      communityId: community._id,
    });

    if (exists) {
      return res.status(400).json({ message: "Already joined" });
    }

    await Membership.create({
      userId: req.user.id,
      communityId: community._id,
      role: "member",
      joinedAt: new Date(),
    });

    await Community.findByIdAndUpdate(community._id, {
      $inc: { memberCount: 1 },
    });

    res.json({ message: "Joined community" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Join failed" });
  }
};

// Community search
export async function searchCommunities(req, res) {
  try {
    let { q = "", page = 1, limit = 20 } = req.query;
    q = q.trim().toLowerCase();

    if (!q) return res.json({ results: [], total: 0 });

    const query = {
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    };

    const total = await Community.countDocuments(query);

    const communities = await Community.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ results: communities, total });
  } catch (err) {
    console.error("searchCommunities error:", err);
    res.status(500).json({ error: "Server error while searching communities" });
  }
}

// Get top communities
export async function getTopCommunities(req, res) {
  try {
    const communities = await Community.find({})
      .sort({ memberCount: -1 }) // highest first
      .limit(5)
      .select("name memberCount iconUrl bannerUrl");

    res.json(communities);
  } catch (err) {
    console.error("getTopCommunities error:", err);
    res.status(500).json({ error: "Failed to load top communities" });
  }
}

// Get user communities
export async function getUserCommunities(req, res) {
  try {
    const userId = req.params.id;

    const memberships = await Membership.find({ userId })
      .populate({
        path: "communityId",
        select: "name title description memberCount iconUrl bannerUrl nsfw",
      })
      .sort({ joinedAt: -1 });

    // Extract and filter the community objects
    const results = memberships
      .map((m) => m.communityId)
      .filter((c) => c !== null);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching communities" });
  }
}

// Leave community
export const leaveCommunity = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { name } = req.params;

    const community = await Community.findOne({ name: name.toLowerCase() });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const membership = await Membership.findOne({
      userId: req.user.id,
      communityId: community._id,
    });

    if (!membership) {
      return res
        .status(400)
        .json({ message: "Not a member of this community" });
    }

    await Membership.deleteOne({ _id: membership._id });

    await Community.findByIdAndUpdate(community._id, {
      $inc: { memberCount: -1 },
    });

    return res.json({ message: "Left community successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Leave community failed" });
  }
};

// Get all comms for explore
export const getAllCommunities = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const query = req.query.query||"";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;


    const [communities, total] = await Promise.all([
      Community.find({ name: { $regex: query, $options: "i" }})
        .sort({ memberCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Community.countDocuments(),
    ]);

    if (!userId) {
      return res.json({
        results: communities.map((c) => ({
          ...c.toObject(),
          isMember: false,
        })),
        total,
      });
    }

    const memberships = await Membership.find({ userId }, { communityId: 1 });

    const memberSet = new Set(memberships.map((m) => m.communityId.toString()));
    const results = communities.map((c) => ({
      ...c.toObject(),
      isMember: memberSet.has(c._id.toString()),
    }));

    res.json({ results, total });
  } catch (err) {
    console.error("getAllCommunities error:", err);
    res.status(500).json({ message: "Failed to load communities" });
  }
};

export const getMembershipStatus = async (req, res) => {
  try {
    const community = await Community.findOne({
      name: req.params.name.toLowerCase(),
    });

    if (!community) {
      return res.status(404).json({ isMember: false, role: null });
    }

    const membership = await Membership.findOne({
      userId: req.user.id,
      communityId: community._id,
    });

    return res.json({
      isMember: !!membership,
      role: membership?.role || null,
    });
  } catch (err) {
    console.error("getMembershipStatus error:", err);
    return res.status(500).json({ isMember: false, role: null });
  }
};

// UPDATE COMMUNITY (moderator only)
export const updateCommunity = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { name } = req.params;
    const community = await Community.findOne({ name: name.toLowerCase() });

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // must be moderator
    const membership = await Membership.findOne({
      userId: req.user.id,
      communityId: community._id,
    });

    if (!membership || membership.role !== "moderator") {
      return res
        .status(403)
        .json({ message: "Only moderators can edit this community" });
    }

    const { newName, description, bannerUrl, iconUrl, title } = req.body || {};

    if (newName && newName.trim()) {
      const normalized = newName.trim().toLowerCase().replace(/^r\//, "");
      const exists = await Community.findOne({
        name: normalized,
        _id: { $ne: community._id },
      });

      if (exists) {
        return res
          .status(409)
          .json({ message: "Community name already exists" });
      }

      community.name = normalized;
      community.title = title || normalized;
    }

    if (typeof description === "string") community.description = description;
    if (typeof bannerUrl === "string") community.bannerUrl = bannerUrl;
    if (typeof iconUrl === "string") community.iconUrl = iconUrl;
    if (typeof title === "string") community.title = title;

    await community.save();
    return res.json({ message: "Community updated", community });
  } catch (err) {
    console.error("updateCommunity error:", err);
    return res.status(500).json({ message: "Failed to update community" });
  }
};
