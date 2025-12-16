import { useState, useEffect } from 'react';
import axios from 'axios';
import EmptyState from './EmptyState';
import CreatePostButton from './CreatePostButton';
import SearchItem from "../../components/SearchItem/SearchItem";

const API_URL = "http://localhost:5000";

export default function ProfileContent({ activeTab = 'Overview' }) {
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const onLeave = (name)=>{
    setCommunities((prev)=>prev.filter((c)=>c.name !== name))
  }

  const onDeletePost = (id) => {
  setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  // ---------- FETCH DATA ----------
  useEffect(() => {
    async function fetchProfileData() {
      try {
        setIsLoading(true);
        // Fetching the user's own posts and communities from the APIs
        const [postsRes, communitiesRes] = await Promise.all([
          axios.get(`${API_URL}/posts/me`, { withCredentials: true }),
          axios.get(`${API_URL}/communities/me`, { withCredentials: true })
        ]);

        // APIs return the array directly as per your controller logic
        setPosts(postsRes.data || []);
        setCommunities(communitiesRes.data || []);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  const hasPosts = posts.length > 0;
  const hasCommunities = communities.length > 0;

  return (
    <div className="card profile-content">
      {/* CREATE POST BUTTON — ALWAYS VISIBLE ON PROFILE */}
      {activeTab === "Posts"&&<CreatePostButton />}

      {isLoading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
      ) : (
        <div className="profile-items-container">
          {/* OVERVIEW TAB */}
          {activeTab === 'Overview' && (
            <>
              {hasPosts ? (
                posts.map(post => (
                  <div key={post._id} className="profile-item-frame">
                    <SearchItem type="post" data={post} />
                  </div>
                ))
              ) : (
                <EmptyState />
              )}
            </>
          )}

          {/* POSTS TAB */}
          {activeTab === 'Posts' && (
            <>
              {hasPosts ? (
                posts.map(post => (
                  <div key={post._id} className="profile-item-frame">
                    <SearchItem type="post" data={post} onDelete={onDeletePost} />
                  </div>
                ))
              ) : (
                <div className="empty-tab-message">
                  This user has no posts yet.
                </div>
              )}
            </>
          )}

          {/* COMMUNITIES TAB */}
          {activeTab === 'Communities' && (
            <>
              {hasCommunities ? (
                communities.map(comm => (
                  <div key={comm._id} className="profile-item-frame">
                    <SearchItem type="community" data={comm} member = {true} onLeave={onLeave}/>
                  </div>
                ))
              ) : (
                <div className="empty-tab-message">
                  This user hasn't joined any communities.
                </div>
              )}
            </>
          )}

          {/* OTHER TABS */}
          {['Saved', 'Hidden', 'Upvoted', 'Downvoted'].includes(activeTab) && (
            <div className="empty-tab-message">
              Nothing here yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}