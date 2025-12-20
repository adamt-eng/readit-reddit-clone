import { useState, useEffect } from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import TrendingPosts from "../../components/Posts/TrendingPosts/TrendingPosts";
import TopCommunities from "../../components/TopCommunities/TopCommunities";
import axios from "axios";
import "./GuestHomePage.css";

export default function GuestHomePage({ setShowAuth }) {
  const PAGE_LIMIT = 50;

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem("viewMode") === "compact"
        ? "compact"
        : "card";
    } catch {
      return "card";
    }
  });

  const [expandedPosts, setExpandedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem("expandedPosts");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize expandedPostId from localStorage
  const [expandedPostId] = useState(() => {
    try {
      const savedExpandedPostId = localStorage.getItem("expandedPostId");
      if (savedExpandedPostId) {
        const parsedId = JSON.parse(savedExpandedPostId);
        return typeof parsedId === "number" ? parsedId : null;
      }
    } catch (error) {
      console.error("Error loading expanded post from localStorage:", error);
    }
    return null;
  });

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const diff = Date.now() - new Date(dateString).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return m < 1 ? "just now" : `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d}d ago`;
    const mo = Math.floor(d / 30);
    if (mo < 12) return `${mo}mo ago`;
    return `${Math.floor(mo / 12)}y ago`;
  };

  useEffect(() => {
    async function fetchGuestFeed() {
      try {
        setIsLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts/feed/guest`,
          {
            params: {
              page,
              limit: PAGE_LIMIT,
            },
          }
        );

        const fetchedPosts = (res.data.posts || []).map((p) => ({
          id: p._id,
          _id: p._id,
          community: p.community || "",
          communityIcon: p.communityIcon || null, 
          user: p.user || "",
          userAvatar: p.userAvatar || "/profile.png",
          title: p.title || "",
          content: p.content || "",
          upvotes: p.upvotes || 0,
          downvotes: p.downvotes || 0,
          voteCount: (p.upvotes || 0) - (p.downvotes || 0),
          comments: p.comments || 0,
          time: formatTimeAgo(p.createdAt),
          userVote: 0,
          image: p.media?.url || null,
          isExpanded: expandedPosts.includes(p._id),
          type: p.type || "text",
        }));

        setPosts((prev) =>
          page === 1 ? fetchedPosts : [...prev, ...fetchedPosts]
        );

        setHasMore(res.data.hasMore);
      } catch (err) {
        console.error("Guest feed error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGuestFeed();
  }, [page, expandedPosts]);

  useEffect(() => {
    try {
      localStorage.setItem("viewMode", viewMode);
    } catch {}
  }, [viewMode]);

  useEffect(() => {
    try {
      localStorage.setItem("expandedPosts", JSON.stringify(expandedPosts));
    } catch {}
  }, [expandedPosts]);

  // Save expandedPostId to localStorage whenever it changes
  useEffect(() => {
    try {
      if (expandedPostId) {
        localStorage.setItem("expandedPostId", JSON.stringify(expandedPostId));
      } else {
        localStorage.removeItem("expandedPostId");
      }
    } catch (error) {
      console.error("Error saving expanded post to localStorage:", error);
    }
  }, [expandedPostId]);

  const toggleViewMode = (e) => {
    e.stopPropagation(); // Prevent the click from bubbling up to parent
    setViewMode((v) => (v === "card" ? "compact" : "card"));
  };

  const getThumbnailImage = (post) => {
    if (post.image) {
      return `${import.meta.env.VITE_API_URL}${post.image}`;
    }
    return "/compact-image.png";
  };

  const toggleExpand = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, isExpanded: !post.isExpanded } : post
      )
    );

    setExpandedPosts((prev) => {
      if (prev.includes(postId)) {
        return prev.filter((id) => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
  };

  const formatNumber = (num) =>
    num >= 1000
      ? (num / 1000).toFixed(1).replace(/\.0$/, "") + "k"
      : num.toString();

  const handleGuestInteraction = (e) => {
    // Only show auth modal if clicked outside the view mode button
    if (!e.target.closest('.view-toggle-btn')) {
      setShowAuth(true);
    }
  };

  return (
    <div
      className="page-container"
      onClick={handleGuestInteraction}
      style={{ cursor: 'pointer' }}
    >
      <LeftSidebar recentCommunity="news" />

      <div className="main-feed">
        <div className="feed-controls">
          <div className="sort-options">
            <button 
              className="view-toggle-btn" 
              onClick={toggleViewMode}
            >
              {viewMode === "card" ? "☐" : "≡"}
            </button>
          </div>
        </div>

        {isLoading && page === 1 ? (
          <div className="sr-loading">
            <div className="sr-spinner"></div>
            <span>Loading posts...</span>
          </div>
        ) : (
          <TrendingPosts
            posts={posts}
            viewMode={viewMode}
            formatNumber={formatNumber}
            getThumbnailImage={getThumbnailImage}
            toggleExpand={toggleExpand}
            isGuest={true}
            onPromptLogin={() => setShowAuth(true)}
            // Pass the missing props that HomePage passes
            expandedPostId={expandedPostId}
            onHidePost={() => {}} // Empty function for guest
            onUnhidePost={() => {}} // Empty function for guest
            hiddenPosts={[]}
            recentPosts={[]}
            onClearRecentPosts={() => {}}
            showRecentPosts={false}
            isLoading={isLoading}
            joinedCommunities={[]} 
          />
        )}

        {hasMore && !isLoading && (
          <div className="feed-end">
            <div className="feed-end-line"></div>
            <p>Login to view more</p>
          </div>
        )}

        {!hasMore && !isLoading && posts.length > 0 && (
          <div className="feed-end">
            <div className="feed-end-line"></div>
            <p>You're all caught up</p>
          </div>
        )}
      </div>

      <div className="sidebar">
        <TopCommunities />
      </div>

      <div className="footer-text">
        <p className="footer-line">
          Reddit Rules Privacy Policy User Agreement
        </p>
        <p className="footer-copyright">
          Reddit, Inc. © 2025. All rights reserved.
        </p>
      </div>
    </div>
  );
}