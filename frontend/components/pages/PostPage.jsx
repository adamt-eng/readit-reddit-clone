import React, { useState } from "react";
import Post from "../Post/Post";

const initialPost = {
  id: "abc123",
  community: "TheWeeknd",
  author: "TheSiriHansYouEnjoy",
  timeAgo: "4d ago",
  title: "Name a better 5 song run by Abel I'll wait",
  text: "Starboy → Party Monster → False Alarm → Reminder → Rockin'",
  image: "",
  votes: 640,
  commentsCount: 3
};

const initialComments = [
  {
    id: "c1",
    author: "commenter1",
    body: "Amazing post! That whole album was a masterpiece.",
    timeAgo: "3d ago",
    votes: 50,
    userVote: 0,
    replies: [
      {
        id: "c1r1",
        author: "anotherUser",
        body: "Totally agree. The production is insane.",
        timeAgo: "3d ago",
        votes: 12,
        userVote: 0,
        replies: []
      }
    ]
  },
  {
    id: "c2",
    author: "music_lover_99",
    body: "House of Balloons trilogy still hits different though.",
    timeAgo: "2d ago",
    votes: 28,
    userVote: 0,
    replies: []
  }
];

export default function PostPage() {
  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState(initialComments);

  // ← NEW: Handle post upvote
  const handleUpvote = (postId) => {
    setPost(prev => ({ ...prev, votes: prev.votes + 1 }));
  };

  // ← NEW: Handle post downvote
  const handleDownvote = (postId) => {
    setPost(prev => ({ ...prev, votes: prev.votes - 1 }));
  };

  // ← NEW: Handle new comment
  const handleComment = (postId, text) => {
    const newComment = {
      id: `c${Date.now()}`,
      author: "current_user",
      body: text,
      timeAgo: "just now",
      votes: 1,
      userVote: 0,
      replies: []
    };
    setComments(prev => [...prev, newComment]);
    setPost(prev => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
  };

  // ← NEW: Handle comment voting (recursive to support nested replies)
  const handleVote = (commentId, voteType) => {
    const updateVote = (comments) => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          const currentVote = comment.userVote || 0;
          const newVote = currentVote === voteType ? 0 : voteType;
          return {
            ...comment,
            votes: comment.votes - currentVote + newVote,
            userVote: newVote
          };
        }
        if (comment.replies) {
          return { ...comment, replies: updateVote(comment.replies) };
        }
        return comment;
      });
    };
    setComments(updateVote(comments));
  };

  // ← NEW: Handle replies (recursive to support nested replies)
  const handleReply = (commentId, text) => {
    const addReply = (comments) => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          const newReply = {
            id: `r${Date.now()}`,
            author: "current_user",
            body: text,
            timeAgo: "just now",
            votes: 1,
            userVote: 0,
            replies: []
          };
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        if (comment.replies) {
          return { ...comment, replies: addReply(comment.replies) };
        }
        return comment;
      });
    };
    setComments(addReply(comments));
  };

  return (
    <div>
      <Post 
        post={post} 
        comments={comments}
        onUpvote={handleUpvote}      
        onDownvote={handleDownvote}  
        onComment={handleComment}    
        onVote={handleVote}          
        onReply={handleReply}        
      />
    </div>
  );
}