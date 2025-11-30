// src/data/dummyData.js
// FINAL UI-FRIENDLY SCHEMA

// -------------------------------
// Notifications (UI schema)
// -------------------------------
export const notifications = [
  {
    _id: "n1",
    userId: "currentUser",    // receiver of the notification
    type: "post-activity",
    payload: {
      postId: "p1",
      commentId: null,
      fromUser: "user123",
      message: `Activity on your post "Ah the fun of abusing a perks intent due to wording."`
    },
    isRead: false,
    createdAt: new Date(Date.now() - 22 * 60 * 1000) // 22m
  },
  {
    _id: "n2",
    userId: "currentUser",
    type: "comment-activity",
    payload: {
      postId: null,
      commentId: "c1",
      fromUser: "magehunter",
      message: `Activity on your comment "Just wondering if you could ionize green..."`
    },
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1h
  },
  {
    _id: "n3",
    userId: "currentUser",
    type: "reply",
    payload: {
      postId: null,
      commentId: null,
      fromUser: "loreexpert",
      message: `"They're also needed to grow clones" — related lore discussion.`
    },
    isRead: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6h
  },
  {
    _id: "n4",
    userId: "currentUser",
    type: "reply",
    payload: {
      postId: null,
      commentId: null,
      fromUser: "adultcreator",
      message:
        "Fidelius charm? Toolbox from Gaogaigar can reinforce and fix structures..."
    },
    isRead: true,
    createdAt: new Date(Date.now() - 21 * 60 * 60 * 1000) // 21h
  }
];


// -------------------------------
// Posts (UI schema)
// -------------------------------
export const posts = [
  {
    id: "p1",
    communityName: "unpopularopinion",
    title: "Playing video games as an adult sucks",
    upvotes: 35000,
    commentsCount: 5700,
    timeAgo: "3y ago",
    thumbnail: null
  },
  {
    id: "p2",
    communityName: "gamingsuggestions",
    title: "The best single-player games you ever played?",
    upvotes: 128,
    commentsCount: 238,
    timeAgo: "5mo ago",
    thumbnail: null
  },
  {
    id: "p3",
    communityName: "videogames",
    title: "Why did games stop doing this?",
    upvotes: 20000,
    commentsCount: 989,
    timeAgo: "7mo ago",
    thumbnail:
      "https://images.pexels.com/photos/4158/forest-trees-path.jpg?auto=compress"
  },
  {
    id: "p4",
    communityName: "gaming",
    title:
      "No way I'm paying $80 for games when older ones were cheaper and better",
    upvotes: 37000,
    commentsCount: 3000,
    timeAgo: "7mo ago",
    thumbnail:
      "https://images.pexels.com/photos/1631677/pexels-photo-1631677.jpeg?auto=compress"
  }
];

// -------------------------------
// Communities (UI schema)
// -------------------------------
export const communities = [
  {
    id: "c1",
    name: "Games",
    membersCount: 3500000
  },
  {
    id: "c2",
    name: "gaming",
    membersCount: 47000000
  },
  {
    id: "c3",
    name: "videogames",
    membersCount: 513000
  },
  {
    id: "c4",
    name: "game",
    membersCount: 20000
  },
  {
    id: "c5",
    name: "RedditGames",
    membersCount: 430000
  }
];

// -------------------------------
// Users (UI schema)
// -------------------------------
export const users = [
  {
    id: "u1",
    username: "john_doe",
    displayName: "John Doe",
    avatar: null
  },
  {
    id: "u2",
    username: "gamingwizard",
    displayName: "Gaming Wizard",
    avatar: null
  },
  {
    id: "u3",
    username: "coderqueen",
    displayName: "Coder Queen",
    avatar: null
  }
];

export default {
  notifications,
  posts,
  communities,
  users
};
