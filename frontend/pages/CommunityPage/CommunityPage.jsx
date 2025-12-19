import { useEffect, useState } from "react";
import "./CommunityPage.css";
import { useParams } from "react-router-dom";
import CommunityHeader from "../../components/Community/CommunityHeader/CommunityHeader.jsx";
import PostList from "../../components/Posts/PostList/PostList.jsx";
import CommunitySidebar from "../../components/Community/CommunitySideBar/CommunitySidebar.jsx";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar.jsx";
import axios from "axios";

// Helper function to format time ago (same style as HomePage)
const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
};

function CommunityPage() {
  const { communityName } = useParams();

  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);

  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});

  const [isMember, setIsMember] = useState(false);
  const [role, setRole] = useState(null); // "moderator" | "member" | null

  const handleToggleComments = (postId) => {
    setExpandedPostId((prev) => (prev === postId ? null : postId));
  };

  const handleCommentInputChange = (postId, text) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: text }));
  };

  const handleAddComment = (postId) => {
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        const pid = p._id || p.id;
        if (pid !== postId) return p;

        const newComment = {
          id: Date.now(),
          author: "YourUser",
          content: text,
          time: "now",
          upvotes: 0,
          userVote: 0,
          replies: [],
        };

        return {
          ...p,
          commentsList: [newComment, ...(p.commentsList || [])],
          comments: (p.comments || 0) + 1,
        };
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleVote = async (postId, voteType) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/votes/posts/${postId}`,
        { voteScore: voteType }, // MUST be voteScore (1 or -1)
        { withCredentials: true }
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

      // Update posts with new vote counts and user's current vote
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              upvotes: updatedPost.upvoteCount,
              downvotes: updatedPost.downvoteCount,
              voteCount: updatedPost.upvoteCount - updatedPost.downvoteCount,
              userVote: voteData.posts?.[postId] ?? 0,
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  useEffect(() => {
    async function fetchCommunityData() {
      try {
        // community info
        const commRes = await fetch(
          `${import.meta.env.VITE_API_URL}/communities/${communityName}`,
          { credentials: "include" }
        );
        const commData = await commRes.json().catch(() => ({}));

        if (!commRes.ok) {
          console.error("Community fetch failed:", commData);
          setCommunity({ name: communityName, description: "", memberCount: 0 });
        } else {
          setCommunity(commData);
        }

        // posts
        const postsRes = await fetch(
          `${import.meta.env.VITE_API_URL}/posts/community/${communityName}`,
          { credentials: "include" }
        );
        const postsData = await postsRes.json().catch(() => []);

        if (!postsRes.ok) {
          console.error("Posts fetch failed:", postsData);
          setPosts([]);
        } else {
          
          const normalized = Array.isArray(postsData)
            ? postsData.map((p) => ({
                id: p._id,
                _id: p._id,
                community: p.community || communityName || "",
                communityIcon: p.communityIcon || null,
                user: p.user || "",
                userAvatar: `${p.userAvatar}` || "/profile.png",
                title: p.title || "",
                content: p.content || "",
                upvotes: p.upvotes || 0,
                downvotes: p.downvotes || 0,
                voteCount: (p.upvotes || 0) - (p.downvotes || 0),
                comments: p.comments || 0,
                time: formatTimeAgo(p.createdAt),
                userVote: 0, // filled from /votes/me below
                image: p.media?.url || p.mediaUrl || p.image || null,
                isExpanded: false,
                commentsList: p.commentsList || [],
                type: p.type || "text",
              }))
            : [];

         
          // Fetch votes in parallel with posts
          let voteMap = {};
          try {
            const { data: votesData } = await axios.get(
              `${import.meta.env.VITE_API_URL}/votes/me`,
              { withCredentials: true }
            );
            voteMap = votesData.posts || {};
          } catch {
            /* ignore */
          }

          // Update posts with vote data BEFORE setting state
          const postsWithVotes = normalized.map((post) => ({
            ...post,
            userVote: voteMap[post.id] ?? 0,
          }));

          setPosts(postsWithVotes);
        }

        // membership + role
        const memRes = await fetch(
          `${import.meta.env.VITE_API_URL}/communities/${communityName}/membership`,
          { credentials: "include" }
        );
        const memData = await memRes.json().catch(() => ({}));

        if (memRes.ok) {
          setIsMember(!!memData.isMember);
          setRole(memData.role || null);
        } else {
          setIsMember(false);
          setRole(null);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setPosts([]);
        setCommunity({ name: communityName, description: "", memberCount: 0 });
        setIsMember(false);
        setRole(null);
      }
    }

    fetchCommunityData();
  }, [communityName]);

  if (!community) return null;

  return (
    <div className="pageShell">
      <LeftSidebar />
      <div className="mainWrapper">
        <div className="communityPage">
          <CommunityHeader
            community={community}
            isMember={isMember}
            setIsMember={setIsMember}
          />

          <div className="communityContent">
            <div className="left">
              <PostList
                posts={posts}
                viewMode="card"
                onVote={handleVote} 
                expandedPostId={expandedPostId}
                onToggleComments={handleToggleComments}
                commentInputs={commentInputs}
                onCommentInputChange={handleCommentInputChange}
                onAddComment={handleAddComment}
              />
            </div>

            <div className="right">
              <CommunitySidebar
                community={community}
                isMember={isMember}
                setIsMember={setIsMember}
                isModerator={role === "moderator"}
                onCommunityUpdated={(updated) => setCommunity(updated)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
