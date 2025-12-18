import { useState, useEffect } from "react";
import "./HomePage.css";
import { useNavigate, useLocation } from "react-router-dom";

import TrendingPosts from "../../components/Posts/TrendingPosts/TrendingPosts";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import RecentPosts from "../../components/Posts/RecentPosts/RecentPosts";

import axios from "axios";

// Helper function to format time ago
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

const HomePage = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [posts, setPosts] = useState([]);
  const PAGE_LIMIT = 20;

  const navigate = useNavigate();
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const location = useLocation();
  const isPopular = location.pathname === "/popular";


  // Initialize viewMode from localStorage
  const [viewMode, setViewMode] = useState(() => {
    try {
      const savedViewMode = localStorage.getItem("viewMode");
      return savedViewMode === "compact" ? "compact" : "card";
    } catch (error) {
      console.error("Error loading view mode from localStorage:", error);
      return "card";
    }
  });

  // Initialize sortBy from localStorage
  const [sortBy, setSortBy] = useState(() => {
    try {
      const savedSortBy = localStorage.getItem("sortBy");
      const sortOptions = ["Best", "New", "Top"];
      return sortOptions.includes(savedSortBy) ? savedSortBy : "Best";
    } catch (error) {
      console.error("Error loading sort by from localStorage:", error);
      return "Best";
    }
  });

  // Initialize expandedPosts (for compact view) from localStorage
  const [expandedPosts, setExpandedPosts] = useState(() => {
    try {
      const savedExpandedPosts = localStorage.getItem("expandedPosts");
      if (savedExpandedPosts) {
        const parsedPosts = JSON.parse(savedExpandedPosts);
        return Array.isArray(parsedPosts) ? parsedPosts : [];
      }
    } catch (error) {
      console.error("Error loading expanded posts from localStorage:", error);
    }
    return [];
  });

  // Fetch personalized feed from API
  useEffect(() => {
    async function fetchFeed() {
      try {
        setIsLoadingPosts(true);

        const sortMap = {
          Best: "best",
          New: "new",
          Top: "top",
        };

        const sortByParam = sortMap[sortBy] || "best";

        const res = isPopular
          ? await axios.get(`${import.meta.env.VITE_API_URL}/posts/popular`, {
              params: { page, limit: PAGE_LIMIT },
              withCredentials: true,
            })
          : await axios.get(`${import.meta.env.VITE_API_URL}/posts/feed/me`, {
              params: {
                sort: sortByParam,
                page,
                limit: PAGE_LIMIT,
              },
              withCredentials: true,
            });

        const fetchedPosts = res.data.posts.map((p) => ({
          id: p._id,
          _id: p._id,
          community: p.community || "",
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
          userVote: 0,
          image: p.media?.url || null,
          isExpanded: expandedPosts.includes(p._id),
          commentsList: [],
          type: p.type || "text",
        }));

        // load votes
        try {
          const { data: voteMap } = await axios.get(
            `${import.meta.env.VITE_API_URL}/votes/me`,
            { withCredentials: true },
          );

          fetchedPosts.forEach((post) => {
            post.userVote = voteMap.posts?.[post.id] ?? 0;
          });
        } catch {
          /* empty */
        }

        setPosts((prev) =>
          page === 1 ? fetchedPosts : [...prev, ...fetchedPosts],
        );

        setHasMore(res.data.hasMore);
      } catch (err) {
        console.error("Error fetching feed:", err);
      } finally {
        setIsLoadingPosts(false);
      }
    }

    fetchFeed();
  }, [sortBy, expandedPosts, isPopular, page]);

  //reset paging
  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [sortBy, isPopular]);

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

  // Initialize joinedCommunities from localStorage
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  useEffect(() => {
    const fetchJoinedCommunities = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/memberships/me`,
          { withCredentials: true },
        );

        setJoinedCommunities(res.data);
        console.log("joined: ", joinedCommunities);
      } catch (error) {
        console.error("Error loading joined communities from server:", error);
        setJoinedCommunities({});
      }
    };

    fetchJoinedCommunities();
  });

  // Initialize hiddenPosts from localStorage
  const [hiddenPosts, setHiddenPosts] = useState(() => {
    try {
      const savedHiddenPosts = localStorage.getItem("hiddenPosts");
      if (savedHiddenPosts) {
        const parsedHiddenPosts = JSON.parse(savedHiddenPosts);
        return Array.isArray(parsedHiddenPosts) ? parsedHiddenPosts : [];
      }
    } catch (error) {
      console.error("Error loading hidden posts from localStorage:", error);
    }
    return [];
  });

  // Initialize recentPosts from localStorage with proper error handling
  const [recentPosts, setRecentPosts] = useState(() => {
    try {
      const savedRecentPosts = localStorage.getItem("recentPosts");
      if (savedRecentPosts) {
        const parsedPosts = JSON.parse(savedRecentPosts);
        return Array.isArray(parsedPosts) ? parsedPosts : [];
      }
    } catch (error) {
      console.error("Error loading recent posts from localStorage:", error);
    }
    return [];
  });

  const sortOptions = ["Best", "New", "Top"];

  // Save viewMode to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("viewMode", viewMode);
    } catch (error) {
      console.error("Error saving view mode to localStorage:", error);
    }
  }, [viewMode]);

  // Save sortBy to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("sortBy", sortBy);
    } catch (error) {
      console.error("Error saving sort by to localStorage:", error);
    }
  }, [sortBy]);

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

  // Save expandedPosts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("expandedPosts", JSON.stringify(expandedPosts));
    } catch (error) {
      console.error("Error saving expanded posts to localStorage:", error);
    }
  }, [expandedPosts]);

  // Save recent posts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("recentPosts", JSON.stringify(recentPosts));
    } catch (error) {
      console.error("Error saving recent posts to localStorage:", error);
    }
  }, [recentPosts]);

  // Save hiddenPosts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("hiddenPosts", JSON.stringify(hiddenPosts));
    } catch (error) {
      console.error("Error saving hidden posts to localStorage:", error);
    }
  }, [hiddenPosts]);

  // Save joinedCommunities to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        "joinedCommunities",
        JSON.stringify(joinedCommunities),
      );
    } catch (error) {
      console.error("Error saving joined communities to localStorage:", error);
    }
  }, [joinedCommunities]);

  // Function to add a post to recent posts with proper structure
  const addToRecentPosts = (post) => {
    const recentPost = {
      id: post.id,
      title: post.title,
      image: post.image,
      upvotes: post.upvotes,
      comments: post.comments,
      community: post.community,
      user: post.user,
      userAvatar: `${post.userAvatar}` || "/profile.png",
      communityIcon : `${post.communityIcon}`,
      timestamp: Date.now(),
      time: post.time,
    };

    setRecentPosts((prev) => {
      const filtered = prev.filter((p) => p.id !== post.id);
      const updated = [recentPost, ...filtered].slice(0, 5);
      return updated;
    });
  };

  // Function to clear all recent posts
  const clearRecentPosts = () => {
    setRecentPosts([]);
    localStorage.removeItem("recentPosts");
  };

  // Handle post click - add to recent posts and navigate
  const handlePostClick = (postId) => {
    if (postId === "feed") {
      console.error("Invalid postId 'feed' clicked");
      return;
    }

    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(postId);
    if (!isValidObjectId) {
      console.error("Invalid postId format:", postId);
      return;
    }

    const post = posts.find((p) => p.id === postId);
    if (post) {
      addToRecentPosts(post);
      navigate(`/posts/${postId}`);
    }
  };

  // Function to format relative time
  const formatRelativeTime = (timeString) => {
    if (!timeString) return "";

    let formattedTime = timeString.toLowerCase();

    formattedTime = formattedTime
      .replace(/(\d+)\s+minutes?\s+ago/, "$1m")
      .replace(/(\d+)\s+min\s+ago/, "$1m")
      .replace(/(\d+)\s+hours?\s+ago/, "$1h")
      .replace(/(\d+)\s+days?\s+ago/, "$1d")
      .replace(/(\d+)\s+weeks?\s+ago/, "$1w")
      .replace(/(\d+)\s+months?\s+ago/, "$1mo")
      .replace(/(\d+)\s+years?\s+ago/, "$1y")
      .replace(/\s+ago/, "");

    return formattedTime;
  };

  // Handle hiding a post
  const handleHidePost = (postId, e) => {
    e?.stopPropagation();
    setHiddenPosts((prev) => {
      const updated = [...prev, postId];
      return updated;
    });
  };

  // Handle unhiding a post
  const handleUnhidePost = (postId, e) => {
    e?.stopPropagation();
    setHiddenPosts((prev) => prev.filter((id) => id !== postId));
  };

  // Handle community join toggle
  const handleJoinCommunity = async (communityName, e) => {
    e?.stopPropagation();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/communities/${communityName}/join`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!res.ok) {
        const err = await res.json();
        console.error("Join failed:", err.message);
        return;
      }

      // Update UI only AFTER backend succeeds
      setJoinedCommunities((prev) =>
        prev.includes(communityName) ? prev : [...prev, communityName],
      );
    } catch (err) {
      console.error("Join community error:", err);
    }
  };

  // Function to get thumbnail for recent posts
  const getRecentPostThumbnail = (post) => {
    if (post.image) {
      return post.image;
    }
    return "../../../assets/compact-image.png";
  };

  // Add toggleExpand function for compact view
  const toggleExpand = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, isExpanded: !post.isExpanded } : post,
      ),
    );

    setExpandedPosts((prev) => {
      if (prev.includes(postId)) {
        return prev.filter((id) => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
  };

  // Handle post voting
  const handleVote = async (postId, voteType) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/votes/posts/${postId}`,
        { voteScore: voteType }, // MUST be voteScore (1 or -1)
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
        }),
      );
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  // Function to get thumbnail image for compact view
 const getThumbnailImage = (post) => {
  if (post.image) {
    // Use same logic as expanded image will use
    return `${import.meta.env.VITE_API_URL}${post.image}`;
  }
  return "../../../assets/compact-image.png"; 
};

  const toggleViewMode = () => {
    setViewMode((prev) => {
      return prev === "card" ? "compact" : "card";
    });
  };

  const toggleSortDropdown = () => {
    setShowSortDropdown((prev) => !prev);
  };

  const handleSortSelect = (option) => {
    setSortBy(option);
    setShowSortDropdown(false);
  };

  const handleCommunityClick = (communityName) => {
    console.log(`Opening community page for r/${communityName}`);
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return num.toString();
  };

const EmptyFeedState = () => {
  return (
    <div className="page-container">
      {/* Use LeftSidebar component with start community button */}
      <LeftSidebar
        showStartCommunity={true}
        onStartCommunity={onStartCommunity}
      />

      <h2>Nothing here yet</h2>

      <p>
        Your home feed shows posts from communities you join.
        <br />
        Start by exploring and joining a few communities you like.
      </p>

      <button
        className="feed-empty-cta"
        onClick={() => navigate("/explore")}
      >
        Explore communities
      </button>
    </div>
</div>

  );
};


return (
  <div className="page-container">
    <LeftSidebar/>

    <div className="feed-wrapper">
      <div className="main-feed">
        {!( !isPopular && joinedCommunities.length === 0 ) && (
          <div className="feed-controls">
            {!isPopular && (
              <div className="sort-options">
                <div className="sort-dropdown-container">
                  <button
                    className="sort-btn active"
                    onClick={toggleSortDropdown}
                  >
                    <span>{sortBy}</span>
                    <svg
                      className={`dropdown-icon ${showSortDropdown ? "open" : ""}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {showSortDropdown && (
                    <div className="sort-dropdown">
                      <div className="dropdown-list">
                        {sortOptions.map((option, index) => (
                          <button
                            key={index}
                            className={`dropdown-item ${sortBy === option ? "active" : ""}`}
                            onClick={() => handleSortSelect(option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button className="view-toggle-btn" onClick={toggleViewMode}>
                  {viewMode === "card" ? "☐" : "≡"}
                </button>
              </div>
            )}

            {isPopular && (
              <p style={{ textAlign: "center" }}>
                <strong>Popular</strong>
              </p>
            )}
          </div>
        )}

          {/* Posts */}
          {isLoadingPosts && page === 1 ? (
            <div className="sr-loading">
              <div className="sr-spinner"></div>
              <span>Loading posts...</span>
            </div>
          ) : (
            <TrendingPosts
              posts={posts}
              viewMode={viewMode}
              onVote={handleVote}
              formatNumber={formatNumber}
              onJoinCommunity={handleJoinCommunity}
              joinedCommunities={joinedCommunities}
              expandedPostId={expandedPostId}
              onHidePost={handleHidePost}
              onUnhidePost={handleUnhidePost}
              hiddenPosts={hiddenPosts}
              getThumbnailImage={getThumbnailImage}
              toggleExpand={toggleExpand}
              recentPosts={recentPosts}
              onClearRecentPosts={clearRecentPosts}
              showRecentPosts={true}
              isLoading={isLoadingPosts}
            />
          )}

        {hasMore && !isLoadingPosts && (
          <div className="feed-pagination">
            <button
              className="show-more-btn"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Show more
            </button>
          </div>
        )}

        {!hasMore && !isLoadingPosts && (
          <div className="feed-end">
            <div className="feed-end-line"></div>
            <p>You’re all caught up</p>
          </div>
        )}
      </div>
    </div>

    <div className="sidebar">
      <RecentPosts
        recentPosts={recentPosts}
        darkMode={darkMode}
        onClearRecentPosts={clearRecentPosts}
        onPostClick={handlePostClick}
        onCommunityClick={handleCommunityClick}
        formatRelativeTime={formatRelativeTime}
        formatNumber={formatNumber}
        getRecentPostThumbnail={getRecentPostThumbnail}
      />
    </div>

    <div className="footer-text">
      <p className="footer-line">
        Readit Rules Privacy Policy User Agreement
      </p>
      <p className="footer-copyright">
        Readit, Inc. © 2025. All rights reserved.
      </p>
    </div>
  </div>
);


};

export default HomePage;