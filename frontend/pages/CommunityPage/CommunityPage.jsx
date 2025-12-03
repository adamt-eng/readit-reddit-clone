import React, { useEffect, useState } from "react";
import "./CommunityPage.css";
import { useParams } from "react-router-dom";

import CommunityHeader from "../../components/CommunityHeader/CommunityHeader.jsx";
import SortBar from "../../components/SortBar/SortBar.jsx";
import PostList from "../../components/PostList/PostList.jsx";
import CommunitySidebar from "../../components/CommunitySidebar/CommunitySidebar.jsx";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar.jsx";
import CreateCommunityModal from "../../components/CreateCommunityModal/CreateCommunityModal.jsx";

function CommunityPage() {
  const { name } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);

  // 🔹 modal state lives HERE now
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);

  const openCreateCommunity = () => setIsCreateCommunityOpen(true);
  const closeCreateCommunity = () => setIsCreateCommunityOpen(false);

  useEffect(() => {
    const fetchCommunityData = async () => {
      const communityData = {
        name: "MovieDetails",
        banner: "../../src/assets/moviebanner.jpg",
        icon: "../../src/assets/movieicon.webp",
        description: "Movie Details, Movie Details",
      };

      const postsData = [
        {
          id: 1,
          title:
            "During the dinner scene in the first Alien (1979), it can be noted that in addition to androids, biological weapons and starships, Weyland-Yutani brews beer.",
          text:
            "During the dinner scene in the first Alien (1979), it can be noted that in addition to androids, biological weapons and starships, Weyland-Yutani brews beer.",
          thumbnail: "../../src/assets/alienbeer.jpg",
          community: "MovieDetails",
          author: "u/Cassrole",
          time: "1hr ago",
          flair: "Pro/Costume",
        },
      ];

      setCommunity(communityData);
      setPosts(postsData);
    };

    fetchCommunityData();
  }, [name]);

  if (!community) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* LEFT SIDEBAR with working button */}
      <LeftSidebar onOpenCreateCommunity={openCreateCommunity} />

      {/* MAIN CONTENT pushed to the right of fixed sidebar */}
      <div style={{ marginLeft: "240px", width: "100%" }}>
        <div className="communityPage">
          <CommunityHeader community={community} />

          <div className="communityContent">
            <div className="left">
              <SortBar />
              <PostList posts={posts} />
            </div>

            <CommunitySidebar community={community} />
          </div>
        </div>
      </div>

      {/* CREATE COMMUNITY MODAL */}
      {isCreateCommunityOpen && (
        <CreateCommunityModal onClose={closeCreateCommunity} />
      )}
    </div>
  );
}

export default CommunityPage;
