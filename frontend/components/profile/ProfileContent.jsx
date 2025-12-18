import { useState, useEffect } from "react";
import axios from "axios";
import EmptyState from "./EmptyState";
import CreatePostButton from "./CreatePostButton";
import SearchItem from "../../components/SearchItem/SearchItem";

const API_URL = `${import.meta.env.VITE_API_URL}`;

export default function ProfileContent({
  activeTab = "Posts",
  user = null,
  isMyProfile = false,
}) {
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);

  const onDeleteComment = (id) => {
    setComments((prev) => prev.filter((c) => c._id !== id));
  };

  const onLeave = (name) => {
    setCommunities((prev) => prev.filter((c) => c.name !== name));
  };

  const onDeletePost = (id) => {
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  // FETCH DATA
  useEffect(() => {
    async function fetchProfileData() {
      try {
        setIsLoading(true);
        const [postsRes, communitiesRes, commentsRes] = await Promise.all([
          axios.get(`${API_URL}/posts/users/${user._id}`, {
            withCredentials: true,
          }),
          axios.get(`${API_URL}/communities/users/${user._id}`, {
            withCredentials: true,
          }),
          axios.get(`${API_URL}/comments/users/${user._id}`, {
            withCredentials: true,
          }),
        ]);

        setPosts(postsRes.data || []);
        setCommunities(communitiesRes.data || []);
        setComments(commentsRes.data || []);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileData();
  }, [user?._id]);

  const hasPosts = posts.length > 0;
  const hasCommunities = communities.length > 0;

  return (
    <div className="card profile-content">
      {activeTab === "Posts" && isMyProfile && <CreatePostButton />}

      {isLoading ? (
        <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>
      ) : (
        <div className="profile-items-container">
          {/* POSTS TAB */}
          {activeTab === "Posts" && (
            <>
              {hasPosts ? (
                posts.map((post) => (
                  <div key={post._id} className="profile-item-frame">
                    <SearchItem
                      type="post"
                      data={post}
                      onDelete={onDeletePost}
                      isNotSearch={true}
                      isMyProfile={isMyProfile}
                    />
                  </div>
                ))
              ) : (
                <EmptyState
                  title={"this user hasn't posted anything yet"}
                  message={
                    "Once this user post to a community the post will show up here!"
                  }
                ></EmptyState>
              )}
            </>
          )}

          {/* COMMUNITIES TAB */}
          {activeTab === "Communities" && (
            <>
              {hasCommunities ? (
                communities.map((comm) => (
                  <div key={comm._id} className="profile-item-frame">
                    <SearchItem
                      type="community"
                      data={comm}
                      member={true}
                      onLeave={onLeave}
                      isNotSearch={true}
                      isMyProfile={isMyProfile}
                    />
                  </div>
                ))
              ) : (
                <EmptyState
                  title={"this user is nowhere to be found in any community"}
                  message={
                    "Join a community of this user's interests to dive into the world of reddit!"
                  }
                ></EmptyState>
              )}
            </>
          )}

          {/* COMMENTS TAB */}
          {activeTab === "Comments" && (
            <>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="profile-item-frame">
                    <SearchItem
                      type="comment"
                      data={comment}
                      onDelete={onDeleteComment}
                      isNotSearch={true}
                      isMyProfile={isMyProfile}
                    />
                  </div>
                ))
              ) : (
                <EmptyState
                  title={"this user has no comments yet"}
                  message={
                    "Maybe it's time to say this user's opinion out loud?"
                  }
                ></EmptyState>
              )}
            </>
          )}

          {/* OTHER TABS */}
          {["Saved", "Hidden", "Upvoted", "Downvoted"].includes(activeTab) && (
            <div className="empty-tab-message">Nothing here yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
