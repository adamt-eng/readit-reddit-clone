import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../components/Posts/Post/Post.jsx";

export default function PostPage() {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // SUMMARY STATES
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSummaryMode, setIsSummaryMode] = useState(false);
  const [animatedText, setAnimatedText] = useState("");

  // LOAD POST + COMMENTS
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
        commentsCount: data.commentCount
      });
    };

    const fetchComments = async () => {
      const res = await fetch(
        `http://localhost:5000/posts/${postId}/comments`,
        { credentials: "include" }
      );

      if (!res.ok) return;

      const data = await res.json();

      const convert = (arr) =>
        arr.map((c) => ({
          id: c._id,
          author: c.authorId,
          body: c.content,
          timeAgo: new Date(c.createdAt).toLocaleDateString(),
          votes: c.upvoteCount - c.downvoteCount,
          userVote: 0,
          replies: convert(c.replies || [])
        }));

      setComments(convert(data));
    };

    const load = async () => {
      await fetchPost();
      await fetchComments();
      setLoading(false);
    };

    load();
  }, [postId]);

  // GENERATE SUMMARY (auth-safe, backend decides)
  const handleGenerateSummary = async () => {
    try {
      setIsSummarizing(true);
      setAnimatedText("");

      const res = await fetch(
        `http://localhost:5000/ai-summary/${postId}/generate`,
        { credentials: "include" } 
      );

      if (!res.ok) {
        setIsSummarizing(false);
        return;
      }

      const data = await res.json();

      const summary =
        data.summaryText ||
        data.summary ||
        data.aiSummary ||
        data.text ||
        "";

      if (!summary) {
        setIsSummarizing(false);
        return;
      }

      const words = summary.split(" ");
      let i = 0;

      setIsSummaryMode(true);

      const interval = setInterval(() => {
        setAnimatedText((prev) => prev + words[i] + " ");
        i++;
        if (i >= words.length) {
          clearInterval(interval);
          setIsSummarizing(false);
        }
      }, 40);
    } catch (err) {
      console.error("Error generating summary:", err);
      setIsSummarizing(false);
    }
  };

  if (loading || !post) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <Post
        post={{
          ...post,
          text: isSummaryMode ? animatedText : post.text
        }}
        comments={comments}
        onUpvote={() => setPost((p) => ({ ...p, votes: p.votes + 1 }))}
        onDownvote={() => setPost((p) => ({ ...p, votes: p.votes - 1 }))}
        onComment={() => {}}
        onVote={() => {}}
        onReply={() => {}}
        isSummaryMode={isSummaryMode}
        isSummarizing={isSummarizing}
        onGenerateSummary={handleGenerateSummary}
        onShowOriginal={() => setIsSummaryMode(false)}
      />
    </div>
  );
}
