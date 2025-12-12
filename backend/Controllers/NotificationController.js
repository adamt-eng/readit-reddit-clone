import Notification from "../Models/Notification.js";

import { onlineUsers} from "../server.js";

import User from "../Models/User.js";
import Post from "../Models/Post.js";
import Comment from "../Models/Comment.js";
import Community from "../Models/Community.js";

//final noti format
export async function buildNotificationData(type, payload) {
  const { actorId, postId, commentId } = payload;


  // 1. Get actor username
  const actor = await User.findById(actorId).select("username");
  const actorUsername = actor?.username || "Someone";

  let communityName = "";

  // 2. If related to a post or comment → fetch community name
  if (postId) {
    const post = await Post.findById(postId).select("communityId");
    if (post?.communityId) {
      const community = await Community.findById(post.communityId).select("name");
      communityName = community?.name || "";
    }
  }

  // 3. Build message based on notification type
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


export async function createNotification({ userId, type, payload }) {
  // Prevent self-notifications
  if (!userId || userId.toString() === payload.actorId?.toString()) return;

  // Build payload (fetch actor username, community, etc.)
  const finalPayload = await buildNotificationData(type, payload);

  const notification = await Notification.create({
    userId,
    type,
    payload: finalPayload,
    isRead: false,
    createdAt: new Date(),
  });

  //hetreereer

  return notification;
}


// -----------------------------
// GET /notifications
// Returns all notifications for the logged-in user
// -----------------------------
export const getNotifications = async (req, res) => {
    console.log("fetch");
    
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // 1) Delete notifications older than 1 month
    await Notification.deleteMany({
      userId: req.params.id,   //changetoauth
      createdAt: { $lt: oneMonthAgo}
    });

    // 2) Return only notifications from the past month
    const notifications = await Notification.find({
      userId: req.params.id, //changetoauth
      createdAt: { $gte: oneMonthAgo }
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get notifications" });
  }
};

// -----------------------------
// GET /notifications/unread
// -----------------------------
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

// -----------------------------
// PATCH /notifications/:id/read
// Marks a single notification as read
// -----------------------------
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

// -----------------------------
// PATCH /notifications/read-all
// Marks all notifications as read
// -----------------------------
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

// -----------------------------
// DELETE /notifications/:id
// Delete a specific notification
// -----------------------------
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
      userId: req.params.id, // change to auth
      createdAt: { $lt: oneMonthAgo }
    });

    // 2) Count unread notifications from last month
    const unreadCount = await Notification.countDocuments({
      userId: req.params.id, // change to auth
      isRead: false,
      createdAt: { $gte: oneMonthAgo }
    });

    res.status(200).json({ unreadCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get unread count" });
  }
};


