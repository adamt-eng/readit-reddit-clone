import React, { useEffect, useState } from "react";
import "./CommunityPage.css";
import { useParams } from "react-router-dom";

import alienImg from "../../assets/alienr.jpg";

import CommunityHeader from "../../components/Community/CommunityHeader/CommunityHeader.jsx";
import SortBar from "../../components/SortBar/SortBar.jsx";
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

  // 🔹 modal state lives HERE now
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);

  const openCreateCommunity = () => setIsCreateCommunityOpen(true);
  const closeCreateCommunity = () => setIsCreateCommunityOpen(false);

  // toggle showing comments for a post
  const handleToggleComments = (postId) => {
    setExpandedPostId((prev) => (prev === postId ? null : postId));
  };

  // update the comment textarea for a specific post
  const handleCommentInputChange = (postId, text) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: text }));
  };

  // add a new comment (frontend only)
  const handleAddComment = (postId) => {
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id !== postId) return p;

        const newComment = {
          id: Date.now(),
          author: "YourUser", // TEMP until backend
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

  useEffect(() => {
    console.log("URL param communityName:", communityName);

    const fetchCommunityData = async () => {
      const communityData = {
        name: communityName, 
        banner: "../../assets/moviebanner.jpg",
        icon: "../../assets/movieicon.webp",
        description: "Movie Details, Movie Details",
      };

      const postsData = [
        {
          id: 1,
          title: "During the dinner scene ...",
          content: "During the dinner scene ...",
          image: alienImg,
          community: communityName, 
          user: "Cassrole",
          userAvatar: "../../assets/movieicon.webp",
          time: "1hr ago",
          upvotes: 0,
          comments: 0,
          commentsList: [],
          userVote: 0,
          isExpanded: false,
        },
      ];

      setCommunity(communityData);
      setPosts(postsData);
    };

    fetchCommunityData();
  }, [communityName]); 

  if (!community) return null;

  return (
    <div className="pageShell">
      <LeftSidebar onOpenCreateCommunity={openCreateCommunity} />

      <div className="mainWrapper">
        <div className="communityPage">
          <CommunityHeader community={community} />

          <div className="communityContent">
            <div className="left">
              <SortBar />
              <PostList
                posts={posts}
                viewMode="card"
                expandedPostId={expandedPostId}
                onToggleComments={handleToggleComments}
                commentInputs={commentInputs}
                onCommentInputChange={handleCommentInputChange}
                onAddComment={handleAddComment}
              />
            </div>

            <div className="right">
              <CommunitySidebar community={community} />
            </div>
          </div>
        </div>
      </div>

      {isCreateCommunityOpen && (
        <CreateCommunityModal onClose={closeCreateCommunity} />
      )}
    </div>
  );
}

export default CommunityPage;
