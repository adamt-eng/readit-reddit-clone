import Community from "../Models/Community.js";
import Post from "../Models/Post.js"; // only if you need posts
import Membership from "../Models/Membership.js";

// ----------------------------------------------------
// CREATE COMMUNITY
// ----------------------------------------------------
export const createCommunity = async (req, res) => {
  try {
    const { name, title, description, bannerUrl, iconUrl, nsfw } = req.body || {};

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
      joinedAt: new Date()
    });

    return res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------------------------------
// GET COMMUNITY BY NAME
// /communities/:name
// ----------------------------------------------------
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

// ----------------------------------------------------
// DELETE COMMUNITY
// /communities/:name
// ----------------------------------------------------
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
      return res.status(403).json({ message: "Only moderators can delete this community"});
    }

    // only moderators can delete
    if (membership.role !== "moderator") {
      return res.status(403).json({ message: "Only moderators can delete this community" });
    }

    // optional cleanup
    await Membership.deleteMany({ communityId: community._id });
    // await Post.deleteMany({ communityId: community._id }); // if you want delete posts too

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

    const community = await Community.findOne({ name: req.params.name.toLowerCase() });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const exists = await Membership.findOne({
      userId: req.user.id,
      communityId: community._id
    });

    if (exists) {
      return res.status(400).json({ message: "Already joined" });
    }

    await Membership.create({
    userId: req.user.id,
    communityId: community._id,
    role: "member",
    joinedAt: new Date()
  });

  await Community.findByIdAndUpdate(
  community._id,
  { $inc: { memberCount: 1 } }
  );

    res.json({ message: "Joined community" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Join failed" });
  }
};


//community search
export async function searchCommunities(req, res) {
  try {
    let { q = "", page = 1, limit = 20 } = req.query;
    q = q.trim().toLowerCase();

    if (!q) return res.json({ results: [], total: 0 });

    const query = {
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ]
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


///get top communities
export async function getTopCommunities(req, res) {
  try {
    const communities = await Community.find({})
      .sort({ memberCount: -1 })   // highest first
      .limit(5)
      .select("name memberCount iconUrl bannerUrl");

    res.json(communities);
  } catch (err) {
    console.error("getTopCommunities error:", err);
    res.status(500).json({ error: "Failed to load top communities" });
  }
}


//get user communities
export async function getUserCommunities(req, res) {
  try {
    const userId = req.user.id;

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

    // Returning the array directly as requested
    console.log(results);
    
    res.json(results);
  } catch (err) {
    console.error("getUserCommunities error:", err);
    res.status(500).json({ error: "Server error fetching communities" });
  }
}

//leave comm
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
      return res.status(400).json({ message: "Not a member of this community" });
    }

    await Membership.deleteOne({ _id: membership._id });

    await Community.findByIdAndUpdate(
      community._id,
      { $inc: { memberCount: -1 } }
    );

    return res.json({ message: "Left community successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Leave community failed" });
  }
};


