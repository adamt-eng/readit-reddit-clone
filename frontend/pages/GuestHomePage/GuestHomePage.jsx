/* eslint-disable no-undef */
// pages/GuestHomePage/GuestHomePage.jsx
import React, { useState, useEffect } from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import PopularCommunities from "../../components/PopularCommunities/PopularCommunities";
import TrendingPosts from "../../components/TrendingPosts/TrendingPosts";
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

  const [posts] = useState([
    { 
      id: 1,
      community: "news", 
      user: "newsbot", 
      userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      title: "Ukraine faces losing dignity or US-large peace deal considerations", 
      content: "Despite ongoing negotiations, Ukraine faces difficult choices in the peace deal discussions with international mediators.",
      upvotes: 452, 
      comments: 120,
      time: "4 hours ago",
      userVote: 0,
      image: "https://images.unsplash.com/photo-1593115057322-e94b77572f20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isExpanded: false,
      commentsList: [
        {
          id: 1,
          author: "world_traveler",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
          content: "This is such an important development. Hope they reach a peaceful resolution soon.",
          upvotes: 45,
          userVote: 0,
          time: "2 hours ago",
          replies: [
            {
              id: 2,
              author: "politics_nerd",
              avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
              content: "Agreed! The international community needs to support diplomatic solutions.",
              upvotes: 23,
              userVote: 0,
              time: "1 hour ago",
              replies: []
            }
          ]
        },
        {
          id: 3,
          author: "history_buff",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
          content: "Historical context is important here. Similar situations have occurred in the past.",
          upvotes: 31,
          userVote: 0,
          time: "45 min ago",
          replies: []
        }
      ]
    },
    { 
      id: 2,
      community: "worldnews", 
      user: "wildlifenews", 
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      title: "Grizzly attacks hiker on remote Canadian beach trail", 
      content: "A hiker was unexpectedly attacked by a grizzly bear while exploring remote trails in British Columbia. Rescue operations are underway.",
      upvotes: 321, 
      comments: 45,
      time: "6 hours ago",
      userVote: 0,
      image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isExpanded: false,
      commentsList: [
        {
          id: 4,
          author: "outdoor_enthusiast",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
          content: "Always carry bear spray when hiking in grizzly country! Stay safe out there.",
          upvotes: 67,
          userVote: 0,
          time: "3 hours ago",
          replies: []
        }
      ]
    },
    { 
      id: 3,
      community: "movies", 
      user: "movieupdates",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      title: "Wicked Part 2 box office projections exceed expectations", 
      content: "Early box office projections for Wicked Part 2 are surpassing industry expectations, with pre-sales breaking records.",
      upvotes: 200, 
      comments: 33,
      time: "1 day ago",
      userVote: 0,
      image: null,
      isExpanded: false,
      commentsList: []
    },
    { 
      id: 4,
      community: null,
      user: "react_learner",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      title: "Just built my first React todo app - any feedback welcome!", 
      content: "After learning React for a month, I finally built a todo app with local storage persistence. It has add, delete, and toggle complete functionality. Would love any suggestions for improvement!",
      upvotes: 78, 
      comments: 12,
      time: "2 hours ago",
      userVote: 0,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isExpanded: false,
      isUserPost: true,
      commentsList: [
        {
          id: 5,
          author: "senior_dev",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
          content: "Great job! The code structure looks clean. One suggestion: consider adding drag-and-drop functionality for reordering tasks.",
          upvotes: 24,
          userVote: 0,
          time: "1 hour ago",
          replies: [
            {
              id: 6,
              author: "react_learner",
              avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
              content: "Thanks! I'll look into react-beautiful-dnd for that feature.",
              upvotes: 8,
              userVote: 0,
              time: "30 minutes ago",
              replies: []
            }
          ]
        }
      ]
    }
  ]);

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
    if (expandedPosts.length > 0) {
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

  const handlePostClick = () => {
    // Guest post viewing logic could go here
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
          <button 
            className="view-toggle-btn" 
            onClick={toggleViewMode}
            title={`Current: ${viewMode} view`}
          >
            {viewMode === 'card' ? '☐' : '≡'}
          </button>
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
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
          onCommentVote={handleCommentVote}
          onCommentReply={handleCommentReply}
          getThumbnailImage={getThumbnailImage}
          toggleExpand={toggleExpand}
          isGuest={true}
          onPromptLogin={promptLogin}
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