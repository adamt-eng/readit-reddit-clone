/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import PopularCommunities from "../../components/Community/PopularCommunities/PopularCommunities";
import TrendingPosts from "../../components/Posts/TrendingPosts/TrendingPosts";
import axios from "axios";
import "./GuestHomePage.css";

export default function GuestHomePage({ darkMode, onLogin }) {
  const [viewMode, setViewMode] = useState(() => {
    try {
      const savedViewMode = localStorage.getItem('viewMode');
      return savedViewMode === 'compact' ? 'compact' : 'card';
    } catch {
      return 'card';
    }
  });

  const [expandedPostId, setExpandedPostId] = useState(() => {
    try {
      const saved = localStorage.getItem('expandedPostId');
      const parsed = saved ? JSON.parse(saved) : null;
      return typeof parsed === 'number' ? parsed : null;
    } catch {
      return null;
    }
  });

  const [expandedPosts, setExpandedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('expandedPosts');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("best");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

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

  // Fetch posts from API
  useEffect(() => {
    async function fetchGuestFeed() {
      try {
        setIsLoading(true);
        
        const sortByParam = sortBy === "Best" ? "best" : 
                          sortBy === "Hot" ? "hot" : 
                          sortBy === "New" ? "new" : 
                          sortBy === "Top" ? "top" : "best";
        
        console.log("Fetching guest feed with sort:", sortByParam);
        
        const res = await axios.get(`http://localhost:5000/posts/feed`, {
          params: {
            sort: sortByParam,
            limit: 50
          }
        });

        console.log("Guest feed API response:", res.data);

        const transformedPosts = (res.data.posts || []).map((p) => ({
          id: p._id,
          _id: p._id,
          community: p.community || "",
          user: p.user || "",
          userAvatar: p.userAvatar || "/profile.png",
          title: p.title || "",
          content: p.content || "",
          upvotes: p.upvotes || 0,
          comments: p.comments || 0,
          time: formatTimeAgo(p.createdAt),
          userVote: 0,
          image: p.media?.url || null,
          isExpanded: expandedPosts.includes(p._id),
          commentsList: [],
          type: p.type || "text"
        }));

        try {
          const savedPostVotes = localStorage.getItem('postVotes');
          if (savedPostVotes) {
            const postVotes = JSON.parse(savedPostVotes);
            transformedPosts.forEach(post => {
              const savedVote = postVotes[post.id];
              if (savedVote !== undefined) {
                post.userVote = savedVote;
                post.upvotes = post.upvotes + savedVote;
              }
            });
          }
        } catch (error) {
          console.error('Error loading votes from localStorage:', error);
        }

        console.log("Transformed guest posts:", transformedPosts.length);
        setPosts(transformedPosts);
      } catch (err) {
        console.error("Error fetching guest feed:", err);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGuestFeed();
  }, [sortBy, expandedPosts]);

  const popularCommunities = [
    { 
      id: 1,
      name: "AskMen", 
      members: "888,675",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    { 
      id: 2,
      name: "AskWomen", 
      members: "5,360,108",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    { 
      id: 3,
      name: "PS4", 
      members: "5,507,926",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    { 
      id: 4,
      name: "apple", 
      members: "6,263,518",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    { 
      id: 5,
      name: "NBA2k", 
      members: "78,031",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    }
  ];

  useEffect(() => {
    try {
      localStorage.setItem('viewMode', viewMode);
    } catch { /* empty */ }
  }, [viewMode]);

  useEffect(() => {
    try {
      if (expandedPostId) {
        localStorage.setItem('expandedPostId', JSON.stringify(expandedPostId));
      } else {
        localStorage.removeItem('expandedPostId');
      }
    } catch { /* empty */ }
  }, [expandedPostId]);

  useEffect(() => {
    try {
      localStorage.setItem('expandedPosts', JSON.stringify(expandedPosts));
    } catch { /* empty */ }
  }, [expandedPosts]);

  useEffect(() => {
    if (expandedPosts.length > 0 && posts.length > 0) {
      setPosts(prevPosts => 
        prevPosts.map(post => ({
          ...post,
          isExpanded: expandedPosts.includes(post.id)
        }))
      );
    }
  }, [expandedPosts]);

  const promptLogin = () => {
    alert("Please log in to continue");
    onLogin?.();
  };

  const toggleComments = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const handleVote = () => promptLogin();
  const handleCommentVote = () => promptLogin();
  const handleCommentReply = () => promptLogin();
  const handleAddComment = () => promptLogin();
  const handleCommentInputChange = () => {};
  
  const handleUpvote = (postId, e) => {
    e.stopPropagation();
    promptLogin();
  };

  const handleDownvote = (postId, e) => {
    e.stopPropagation();
    promptLogin();
  };

  const handlePostClick = (postId) => {
    console.log("Guest clicked post:", postId);
    const post = posts.find(p => p.id === postId);
    if (post) {
      promptLogin();
    }
  };

  const handleHidePost = () => promptLogin();

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'card' ? 'compact' : 'card');
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  };

  const getThumbnailImage = (post) => {
    if (post.image) return post.image;
    return darkMode ? "/compact-image-dark.png" : "/compact-image.png";
  };

  const toggleExpand = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const newExpandedState = !post.isExpanded;
          setExpandedPosts(prev => 
            newExpandedState 
              ? (prev.includes(postId) ? prev : [...prev, postId])
              : prev.filter(id => id !== postId)
          );
          return { ...post, isExpanded: newExpandedState };
        }
        return post;
      })
    );
  };

  const handleCommunityClick = (community) => {
    console.log(`Guest clicked on r/${community.name}`);
    promptLogin();
  };

  return (
    <div className="page-container">
      <LeftSidebar 
        darkMode={darkMode} 
        recentCommunity="news"
        onCommunityClick={(communityName) => {
          console.log(`Guest clicked on r/${communityName}`);
          promptLogin();
        }}
      />
      
      <div className="main-feed">
        <div className="feed-controls">
          <div className="sort-options">
            {/* REMOVED THE SORT DROPDOWN - ONLY KEEPING THE VIEW TOGGLE BUTTON */}
            
            {/* View Toggle */}
            <button className="view-toggle-btn" onClick={toggleViewMode}>
              {viewMode === 'card' ? '☐' : '≡'}
            </button>
          </div>
        </div>

        <TrendingPosts
          posts={posts}
          viewMode={viewMode}
          darkMode={darkMode}
          onVote={handleVote}
          formatNumber={formatNumber}
          onToggleComments={toggleComments}
          onPostClick={handlePostClick}
          onJoinCommunity={() => {}}
          joinedCommunities={{}}
          expandedPostId={expandedPostId}
          commentInputs={{}}
          onCommentInputChange={handleCommentInputChange}
          onAddComment={handleAddComment}
          onHidePost={handleHidePost}
          onUnhidePost={() => {}}
          hiddenPosts={[]}
          onCommentVote={handleCommentVote}
          onCommentReply={handleCommentReply}
          getThumbnailImage={getThumbnailImage}
          toggleExpand={toggleExpand}
          isGuest={true}
          onPromptLogin={promptLogin}
          isLoading={isLoading}
        />
      </div>

      <div className="sidebar">
        <PopularCommunities 
          communities={popularCommunities} 
          darkMode={darkMode}
          onCommunityClick={handleCommunityClick}
        />
      </div>

      <div className="footer-text">
        <p className="footer-line">Reddit Rules    Privacy Policy    User Agreement</p>
        <p className="footer-copyright">Reddit, Inc. © 2025. All rights reserved.</p>
      </div>
    </div>
  );
}