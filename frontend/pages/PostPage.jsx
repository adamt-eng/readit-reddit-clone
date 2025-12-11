import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../components/Posts/Post/Post.jsx";

export default function PostPage() {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------
  // Fetch POST + COMMENTS
  // ---------------------------
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/posts/${postId}`);
        const data = await res.json();

        // Map backend fields to frontend expected structure
        setPost({
          id: data._id,
          community: data.communityId?.name,
          author: data.authorId?.username,
          timeAgo: new Date(data.createdAt).toLocaleDateString(),
          title: data.title,
          text: data.content,
          image: data.media?.url,
          votes: data.upvoteCount - data.downvoteCount,
          commentsCount: data.commentCount
        });
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/posts/${postId}/comments`);
        const data = await res.json();

        // Comments already come nested
        const mapped = mapComments(data);
        setComments(mapped);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    const mapComments = (arr) =>
      arr.map((c) => ({
        id: c._id,
        author: c.authorId, // replace later when you populate user
        body: c.content,
        timeAgo: new Date(c.createdAt).toLocaleDateString(),
        votes: c.upvoteCount - c.downvoteCount,
        userVote: 0,
        replies: mapComments(c.replies || [])
      }));

    const load = async () => {
      await fetchPost();
      await fetchComments();
      setLoading(false);
    };

    load();
  }, [postId]);

  // ---------------------------
  // Upvote Post
  // ---------------------------
  const handleUpvote = async () => {
    try {
      await fetch(`http://localhost:5000/posts/${postId}/upvote`, {
        method: "POST"
      });

      setPost((prev) => ({
        ...prev,
        votes: prev.votes + 1
      }));
    } catch (err) {
      console.error("Error upvoting:", err);
    }
  };

  // ---------------------------
  // Downvote Post
  // ---------------------------
  const handleDownvote = async () => {
    try {
      await fetch(`http://localhost:5000/posts/${postId}/downvote`, {
        method: "POST"
      });

      setPost((prev) => ({
        ...prev,
        votes: prev.votes - 1
      }));
    } catch (err) {
      console.error("Error downvoting:", err);
    }
  };

  // ---------------------------
  // Create Comment
  // ---------------------------
  const handleComment = async (postId, text) => {
    try {
      const res = await fetch(`http://localhost:5000/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text })
      });

      const newComment = await res.json();

      // Add to list
      setComments((prev) => [
        ...prev,
        {
          id: newComment._id,
          author: newComment.authorId,
          body: newComment.content,
          timeAgo: new Date(newComment.createdAt).toLocaleDateString(),
          votes: 0,
          userVote: 0,
          replies: []
        }
      ]);

      setPost((prev) => ({
        ...prev,
        commentsCount: prev.commentsCount + 1
      }));
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  // ---------------------------
  // Comment voting (recursive)
  // ---------------------------
  const handleVoteComment = async (commentId, type) => {
    try {
      await fetch(`http://localhost:5000/comments/${commentId}/${type}`, {
        method: "POST"
      });

      const updateVotes = (list) =>
        list.map((c) => {
          if (c.id === commentId) {
            const delta = type === "upvote" ? 1 : -1;
            return { ...c, votes: c.votes + delta };
          }
          if (c.replies) {
            return { ...c, replies: updateVotes(c.replies) };
          }
          return c;
        });

      setComments(updateVotes);
    } catch (err) {
      console.error("Error voting comment:", err);
    }
  };

  // ---------------------------
  // Reply to Comment
  // ---------------------------
  const handleReply = async (commentId, text) => {
    try {
      const res = await fetch(
        `http://localhost:5000/comments/${commentId}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text })
        }
      );

      const reply = await res.json();

      const addReply = (arr) =>
        arr.map((c) => {
          if (c.id === commentId) {
            return {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: reply._id,
                  author: reply.authorId,
                  body: reply.content,
                  timeAgo: new Date(reply.createdAt).toLocaleDateString(),
                  votes: 0,
                  userVote: 0,
                  replies: []
                }
              ]
            };
          }
          if (c.replies) return { ...c, replies: addReply(c.replies) };
          return c;
        });

      setComments(addReply);
      setPost((prev) => ({
        ...prev,
        commentsCount: prev.commentsCount + 1
      }));
    } catch (err) {
      console.error("Error replying:", err);
    }
  };

  // ---------------------------
  // LOADING STATE
  // ---------------------------
  if (loading || !post) return <div>Loading...</div>;

  return (
    <Post
      post={post}
      comments={comments}
      onUpvote={handleUpvote}
      onDownvote={handleDownvote}
      onComment={handleComment}
      onVote={(id, type) =>
        handleVoteComment(id, type === 1 ? "upvote" : "downvote")
      }
      onReply={handleReply}
    />
  );
}
