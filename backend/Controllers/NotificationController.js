import Notification from "../Models/Notification.js";

import { onlineUsers} from "../server.js";

import User from "../Models/User.js";
import Post from "../Models/Post.js";
import Comment from "../Models/Comment.js";
import Community from "../Models/Community.js";

//final noti format
export async function buildNotificationData(type, payload) {
  const { actorId, postId, commentId } = payload;


  const actor = await User.findById(actorId).select("username");
  const actorUsername = actor?.username || "Someone";

  let communityName = "";

  if (postId) {
    const post = await Post.findById(postId).select("communityId");
    if (post?.communityId) {
      const community = await Community.findById(post.communityId).select("name");
      communityName = community?.name || "";
    }
  }
  let message = "";

  switch (type) {
    case "profile_view":
      message = `${actorUsername} viewed your profile!`;
      break;

    case "post_upvote":
      message = `${actorUsername} upvoted your post in r/${communityName}`;
      break;

    case "comment_upvote":
      message = `${actorUsername} upvoted your comment in r/${communityName}`;
      break;

    case "private_message":
      message = `${actorUsername} sent you a message`;
      break;

    case "comment_reply":
      message = `${actorUsername} replied to your comment in r/${communityName}`;
      break;

    default:
      message = `${actorUsername} sent you a notification`;
  }

  return {
    ...payload,
    message,
  };
}


export async function createNotification({
  userId,
  type,
  payload,
  io,
  onlineUsers
}) {
  // prevent self notification
  if (!userId || userId.toString() === payload.actorId?.toString()) return;

  const finalPayload = await buildNotificationData(type, payload);

  const notification = await Notification.create({
    userId,
    type,
    payload: finalPayload,
    isRead: false,
    createdAt: new Date(),
  });

  if (onlineUsers instanceof Map && io) {
    const socketId = onlineUsers.get(userId.toString());
    if (socketId) {
      io.to(socketId).emit("notification", notification);
    }
  }
  return notification;
}




// get user notis
export const getNotifications = async (req, res) => {
    console.log("fetch");
    
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    await Notification.deleteMany({
      userId: req.user.id,   
      createdAt: { $lt: oneMonthAgo}
    });

    // Return only notifications from the past month
    const notifications = await Notification.find({
      userId: req.user.id,
      createdAt: { $gte: oneMonthAgo }
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get notifications" });
  }
};


//get user unread notis
export const getUnreadNotifications = async (req, res) => {
  try {
    const unread = await Notification.find({
      userId: req.user.id,
      isRead: false,
    }).sort({ createdAt: -1 });

    res.status(200).json(unread);
  } catch (err) {
    res.status(500).json({ message: "Failed to get unread notifications" });
  }
};


//mark a noti as read
export const markAsRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
};



//mark all notis as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark all as read" });
  }
};


//delete a noti
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete notification" });
  }
};




// -----------------------------
// DELETE /notifications
// Delete all notifications (optional)
// -----------------------------
export const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user.id });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete all notifications" });
  }
};

// -----------------------------
// GET /notifications/unread-count
// Returns unread notifications count 
// -----------------------------
export const getUnreadCount = async (req, res) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // 1) Remove old notifications
    await Notification.deleteMany({
      userId: req.user.id, // change to auth
      createdAt: { $lt: oneMonthAgo }
    });

    // 2) Count unread notifications from last month
    const unreadCount = await Notification.countDocuments({
      userId: req.user.id, // change to auth
      isRead: false,
      createdAt: { $gte: oneMonthAgo }
    });

    res.status(200).json({ unreadCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get unread count" });
  }
};


