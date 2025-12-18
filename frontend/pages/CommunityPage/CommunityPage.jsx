import { useEffect, useState } from "react";
import "./CommunityPage.css";
import { useParams } from "react-router-dom";
import CommunityHeader from "../../components/Community/CommunityHeader/CommunityHeader.jsx";
import PostList from "../../components/Posts/PostList/PostList.jsx";
import CommunitySidebar from "../../components/Community/CommunitySideBar/CommunitySidebar.jsx";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar.jsx";
import CreateCommunityModal from "../../components/Community/CreateCommunityModal/CreateCommunityModal.jsx";

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
      }),
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        //community info
        const commRes = await fetch(
          `${import.meta.env.VITE_API_URL}/communities/${communityName}`,
          { credentials: "include" },
        );
        const commData = await commRes.json().catch(() => ({}));

        if (!commRes.ok) {
          console.error("Community fetch failed:", commData);
          setCommunity({
            name: communityName,
            description: "",
            memberCount: 0,
          });
        } else {
          setCommunity(commData);
        }

        // posts
        const postsRes = await fetch(
          `${import.meta.env.VITE_API_URL}/posts/community/${communityName}`,
          { credentials: "include" },
        );
        const postsData = await postsRes.json().catch(() => []);

        if (!postsRes.ok) {
          console.error("Posts fetch failed:", postsData);
          setPosts([]);
        } else {
          setPosts(
          Array.isArray(postsData)
            ? postsData.map((p) => ({
                ...p,
                id: p._id,
              }))
            : []
);

        }

        //membership + role
        const memRes = await fetch(
          `${import.meta.env.VITE_API_URL}/communities/${communityName}/membership`,
          { credentials: "include" },
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
    };

    fetchCommunityData();
  }, [communityName]);

  if (!community) return null;

  return (
    <div className="pageShell">
      <LeftSidebar/>
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
                expandedPostId={expandedPostId}
                showJoined = {false}
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