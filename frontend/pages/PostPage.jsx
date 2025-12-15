import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../components/Posts/Post/Post.jsx";

export default function PostPage() {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD POST + COMMENTS ---------------- */

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(
        `http://localhost:5000/posts/${postId}`,
        { credentials: "include" }
      );
      if (!res.ok) return;

      const data = await res.json();

      setPost({
        id: data._id,
        community: data.communityId?.name,
        author: data.authorId?.username,
        timeAgo: new Date(data.createdAt).toLocaleDateString(),
        title: data.title,
        text: data.content,
        image: data.media?.url,
        votes: data.upvoteCount - data.downvoteCount,
        commentsCount: data.commentCount,
        userVote: 0
      });
    };

    const fetchComments = async () => {
      const res = await fetch(
        `http://localhost:5000/posts/${postId}/comments`,
        { credentials: "include" }
      );
      if (!res.ok) return;

      const data = await res.json();

      const normalize = (arr) =>
        arr.map((c) => ({
          id: c._id,
          author: c.authorId?.username ?? "unknown",
          content: c.content,
          timeAgo: new Date(c.createdAt).toLocaleDateString(),
          votes: (c.upvoteCount || 0) - (c.downvoteCount || 0),
          userVote: 0,
          replies: normalize(c.replies || [])
        }));

      setComments(normalize(data));
    };

    Promise.all([fetchPost(), fetchComments()]).then(() =>
      setLoading(false)
    );
  }, [postId]);

  /* ---------------- POST VOTING ---------------- */

  const handlePostVote = async (voteScore) => {
    const res = await fetch(
      `http://localhost:5000/votes/posts/${postId}`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteScore })
      }
    );

    if (!res.ok) return;
    const data = await res.json();

    setPost((prev) => ({
      ...prev,
      votes: data.post.upvoteCount - data.post.downvoteCount,
      userVote: prev.userVote === voteScore ? 0 : voteScore
    }));
  };

  /* ---------------- COMMENT VOTING ---------------- */

  const handleCommentVote = async (commentId, voteType) => {
    const res = await fetch(
      `http://localhost:5000/votes/comments/${commentId}`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteScore: voteType })
      }
    );

    if (!res.ok) return;
    const data = await res.json();

    const updateVotes = (arr) =>
      arr.map((c) =>
        c.id === commentId
          ? {
              ...c,
              votes:
                data.comment.upvoteCount - data.comment.downvoteCount,
              userVote: c.userVote === voteType ? 0 : voteType
            }
          : { ...c, replies: updateVotes(c.replies) }
      );

    setComments(updateVotes);
  };

  /* ---------------- COMMENT CREATE ---------------- */

  const handleComment = async (postId, text) => {
    const res = await fetch(
      `http://localhost:5000/posts/${postId}/comments`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text })
      }
    );

    if (!res.ok) return;
    const data = await res.json();

    const newComment = {
      id: data._id,
      author: data.authorId.username,
      content: data.content,
      timeAgo: new Date(data.createdAt).toLocaleDateString(),
      votes: 0,
      userVote: 0,
      replies: []
    };

    setComments((prev) => [newComment, ...prev]);
    setPost((prev) => ({
      ...prev,
      commentsCount: prev.commentsCount + 1
    }));
  };

  /* ---------------- COMMENT REPLY ---------------- */

  const handleReply = async (commentId, text) => {
    const res = await fetch(
      `http://localhost:5000/comments/${commentId}/reply`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text })
      }
    );

    if (!res.ok) return;
    const data = await res.json();

    const reply = {
      id: data._id,
      author: data.authorId.username,
      content: data.content,
      timeAgo: new Date(data.createdAt).toLocaleDateString(),
      votes: 0,
      userVote: 0,
      replies: []
    };

    const insertReply = (arr) =>
      arr.map((c) =>
        c.id === commentId
          ? { ...c, replies: [...c.replies, reply] }
          : { ...c, replies: insertReply(c.replies) }
      );

    setComments(insertReply);
  };

  /* ---------------- RENDER ---------------- */

  if (loading || !post) return <div>Loading...</div>;

  return (
    <Post
      post={post}
      comments={comments}
      onUpvote={() => handlePostVote(1)}
      onDownvote={() => handlePostVote(-1)}
      onComment={handleComment}
      onVote={handleCommentVote}
      onReply={handleReply}
    />
  );
}
