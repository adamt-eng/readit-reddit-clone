import mongoose from "mongoose";
import Membership from "../Models/Membership.js";

export const getMyJoinedCommunities = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const communities = await Membership.aggregate([
     {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: "communities",
          localField: "communityId",
          foreignField: "_id",
          as: "community"
        }
      },
      {
        $unwind: "$community"
      },
      {
        $project: {
          _id: 0,
          name: "$community.name"
        }
      }
    ]);

    // return only array of names
    const communityNames = communities.map(c => c.name);
    console.log(communityNames);
    res.json(communityNames);
  } catch (err) {
    console.error("getMyJoinedCommunities error:", err);
    res.status(500).json({ message: "Failed to fetch joined communities" });
  }
};
