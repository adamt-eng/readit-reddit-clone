import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../../components/Posts/Post/Post.jsx";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar.jsx";
import axios from "axios";

export default function PostPage() {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSummaryMode, setIsSummaryMode] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const [typingText, setTypingText] = useState("");
  const [summaryText, setSummaryText] = useState("");



  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    return new Date(dateString).toLocaleDateString();
  };

const handleGenerateSummary = async (forceRegenerate = false) => {
  try {
    setIsSummarizing(true);
    setTypingText("");

    // capture original text ONCE
    if (!originalText) {
      setOriginalText(post.text);
    }

    const endpoint = forceRegenerate
      ? `/ai-summary/${post.id}/generate`
      : `/ai-summary/${post.id}`;

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}${endpoint}`,
      { withCredentials: true }
    );

    const summary = res.data.summaryText;

    setIsSummaryMode(true);
    setSummaryText(""); // reset before animation

    const words = summary.split(" ");
    let index = 0;

    const interval = setInterval(() => {
      index++;
      setTypingText(words.slice(0, index).join(" "));

      if (index >= words.length) {
        clearInterval(interval);
        setIsSummarizing(false);
        setTypingText("");
        setSummaryText(summary);
      }
    }, 35);

  } catch (err) {
    console.error("Error generating summary:", err);
    setIsSummarizing(false);
  }
};


const handleShowOriginal = () => {
  setIsSummaryMode(false);
  setTypingText("");
};


  /* POST EDIT */
const handleEditPost = async ({ title, text, removeImage }) => {
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/posts/${postId}`,
      {
        title,
        content: text,
        removeImage,
      },
      { withCredentials: true }
    );

    const updated = res.data;

    setPost((prev) => ({
      ...prev,
      title: updated.title,
      text: updated.content,
      image: removeImage ? null : prev.image,
    }));
    // Reset summary state on edit
    setIsSummaryMode(false);
    setSummaryText("");
    setTypingText("");
    setOriginalText(updated.content);

  } catch (err) {
    console.error("Failed to edit post:", err);
  }
};

  const updateRecentPosts = (post) => {
    try {
      const savedRecentPosts = localStorage.getItem('recentPosts');
      let recentPosts = [];
      
      if (savedRecentPosts) {
        try {
          recentPosts = JSON.parse(savedRecentPosts);
          if (!Array.isArray(recentPosts)) {
            recentPosts = [];
          }
        } catch {
          recentPosts = [];
        }
      }
      
      // Remove if post already exists
      const filtered = recentPosts.filter(p => p.id !== post.id);
      
      // Add new post at the beginning
      const updated = [post, ...filtered].slice(0, 5); // Keep only 5 most recent
      
      // Save back to localStorage
      localStorage.setItem('recentPosts', JSON.stringify(updated));
      
      // Dispatch storage event to notify HomePage
      window.dispatchEvent(new Event('storage'));
      
      return updated;
    } catch (error) {
      console.error('Error updating recent posts:', error);
      return [];
    }
  };

  /* LOAD POST + COMMENTS */
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts/${postId}`,
          { withCredentials: true },
        );

        const data = res.data;

        let userVote = 0;
        try {
          const voteRes = await fetch(
            `${import.meta.env.VITE_API_URL}/votes/me`,
            { credentials: "include" }
          );
          if (voteRes.ok) {
            const voteData = await voteRes.json();
            userVote = voteData.posts?.[data._id] ?? 0;
          }
        } catch {}

        setPost({
          id: data._id,
          community: data.communityId?.name,
          communityIcon: data.communityId?.iconUrl,
          author: data.authorId?.username,
          authorId: data.authorId?._id,
          timeAgo: new Date(data.createdAt).toLocaleDateString(),
          title: data.title,
          text: data.content,
          image: data.media?.url
            ? `${import.meta.env.VITE_API_URL}${data.media.url}`
            : null,
          votes: data.upvoteCount - data.downvoteCount,
          commentsCount: data.commentCount,
          userVote: userVote,
          canEdit: data.canEdit,
        });
      } catch (err) {
        console.log("Error while fetching post ", err);
      }
    };

    const fetchComments = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/${postId}/comments`,
        { credentials: "include" },
      );
      if (!res.ok) return;

      const data = await res.json();

      // Fetch user's comment votes
      const voteRes = await fetch(`${import.meta.env.VITE_API_URL}/votes/me`, {
        credentials: "include",
      });
      let commentVotes = {};
      if (voteRes.ok) {
        const voteData = await voteRes.json();
        commentVotes = voteData.comments || {};
      }

      const normalize = (arr) =>
        arr.map((c) => ({
          id: c._id,
          author: c.authorId?.username ?? "unknown",
          content: c.content,
          timeAgo: new Date(c.createdAt).toLocaleDateString(),
          votes: (c.upvoteCount || 0) - (c.downvoteCount || 0),
          userVote: commentVotes[c._id] ?? 0,
          replies: normalize(c.replies || []),
        }));

      setComments(normalize(data));
    };

    Promise.all([fetchPost(), fetchComments()]).then(() => setLoading(false));
  }, [postId]);

  /* POST VOTING */
  const handlePostVote = async (voteScore) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/votes/posts/${postId}`,
      { voteScore: voteScore },
      { withCredentials: true },
    );

    const updatedPost = res.data.post;

    // Fetch the updated vote state from backend to get accurate userVote
    const voteRes = await fetch(
      `${import.meta.env.VITE_API_URL}/votes/me`,
      { credentials: "include" }
    );

    if (!voteRes.ok) {
      console.error("Failed to fetch vote state");
      return;
    }

    const voteData = await voteRes.json();

    // Update post state
    setPost((prev) => ({
      ...prev,
      votes: updatedPost.upvoteCount - updatedPost.downvoteCount,
      userVote: voteData.posts?.[postId] ?? 0,
    }));

    // Update recent posts with new vote count
    const savedRecentPosts = localStorage.getItem('recentPosts');
    if (savedRecentPosts) {
      try {
        let recentPosts = JSON.parse(savedRecentPosts);
        
        recentPosts = recentPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              upvotes: updatedPost.upvoteCount || 0,
              downvotes: updatedPost.downvoteCount || 0,
              timestamp: Date.now()
            };
          }
          return post;
        });
        
        localStorage.setItem('recentPosts', JSON.stringify(recentPosts));
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error('Error updating vote count in recent posts:', error);
      }
    }
  };

  /* COMMENT VOTING */
  const handleCommentVote = async (commentId, voteType) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/votes/comments/${commentId}`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteScore: voteType }),
      },
    );

    if (!res.ok) return;
    const data = await res.json();

    // Fetch the updated vote state from backend to get accurate userVote
    const voteRes = await fetch(
      `${import.meta.env.VITE_API_URL}/votes/me`,
      { credentials: "include" }
    );

    if (!voteRes.ok) {
      console.error("Failed to fetch vote state");
      return;
    }

    const voteData = await voteRes.json();

    const updateVotes = (arr) =>
      arr.map((c) =>
        c.id === commentId
          ? {
              ...c,
              votes: data.comment.upvoteCount - data.comment.downvoteCount,
              userVote: voteData.comments?.[commentId] ?? 0,
            }
          : { ...c, replies: updateVotes(c.replies) },
      );

    setComments(updateVotes);
  };

  /* COMMENT CREATE */
  const handleComment = async (postId, text) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/posts/${postId}/comments`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      },
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
      replies: [],
    };

    setComments((prev) => [newComment, ...prev]);
    setPost((prev) => ({
      ...prev,
    ]);
  };

  /* COMMENT REPLY */
  const handleReply = async (commentId, text) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/comments/${commentId}/reply`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      },
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
      replies: [],
    };

    const insertReply = (arr) =>
      arr.map((c) =>
        c.id === commentId
          ? { ...c, replies: [...c.replies, reply] }
          : { ...c, replies: insertReply(c.replies) },
      );

    setComments(insertReply);
  };

  /* RENDER */
  if (loading || !post) return <div>Loading...</div>;

  return (
    <div className="page-layout">
      <div className="page-sidebar">
        <LeftSidebar />
      </div>
      <div className="page-main">
        <Post
          post={post}
          comments={comments}
          onUpvote={() => handlePostVote(1)}
          onDownvote={() => handlePostVote(-1)}
          onComment={handleComment}
          onVote={handleCommentVote}
          onReply={handleReply}
          onEdit={handleEditPost}
          isSummarizing={isSummarizing}
          isSummaryMode={isSummaryMode}
          summaryText={summaryText}
          onGenerateSummary={handleGenerateSummary}
          onShowOriginal={handleShowOriginal}
          typingText={typingText}
        />
      </div>
    </div>
  );
}