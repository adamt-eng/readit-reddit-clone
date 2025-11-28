// pages/GuestHomePage/GuestHomePage.jsx
import React, { useState, useEffect } from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import PopularCommunities from "../../components/PopularCommunities/PopularCommunities";
import { FaRegCommentAlt, FaShare, FaBookmark, FaEllipsisH, FaFlag  } from "react-icons/fa";
import "./GuestHomePage.css";
import { FaExpand, FaCompress } from "react-icons/fa";
import Comment from "../../components/Comment/Comment";
import TrendingPosts from "../../components/TrendingPosts/TrendingPosts";

export default function GuestHomePage({ darkMode, onLogin }) {
  // Initialize viewMode from localStorage
  const [viewMode, setViewMode] = useState(() => {
    try {
      const savedViewMode = localStorage.getItem('viewMode');
      return savedViewMode === 'compact' ? 'compact' : 'card';
    } catch (error) {
      console.error('Error loading view mode from localStorage:', error);
      return 'card';
    }
  });

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [joinedCommunities, setJoinedCommunities] = useState({});
  
  // Initialize expandedPostId from localStorage
  const [expandedPostId, setExpandedPostId] = useState(() => {
    try {
      const savedExpandedPostId = localStorage.getItem('expandedPostId');
      if (savedExpandedPostId) {
        const parsedId = JSON.parse(savedExpandedPostId);
        console.log('Loaded expandedPostId from localStorage:', parsedId);
        return typeof parsedId === 'number' ? parsedId : null;
      }
    } catch (error) {
      console.error('Error loading expanded post from localStorage:', error);
    }
    return null;
  });

  // Initialize expanded posts state from localStorage
  const [expandedPosts, setExpandedPosts] = useState(() => {
    try {
      const savedExpandedPosts = localStorage.getItem('expandedPosts');
      if (savedExpandedPosts) {
        const parsed = JSON.parse(savedExpandedPosts);
        console.log('Loaded expandedPosts from localStorage:', parsed);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Error loading expanded posts from localStorage:', error);
    }
    return [];
  });

  const [posts, setPosts] = useState([
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
      image: "https://images.unsplash.com/photo-1593115057322-e94b77572f20?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
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
      image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
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
    // User profile post (without community)
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
      name: "AskMen", 
      members: "888,675",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    { 
      name: "AskWomen", 
      members: "5,360,108",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    { 
      name: "PS4", 
      members: "5,507,926",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    { 
      name: "apple", 
      members: "6,263,518",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    },
    { 
      name: "NBA2k", 
      members: "78,031",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
    }
  ];


  // Save viewMode to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('viewMode', viewMode);
      console.log('Saved viewMode to localStorage:', viewMode);
    } catch (error) {
      console.error('Error saving view mode to localStorage:', error);
    }
  }, [viewMode]);

  // Save expandedPostId to localStorage whenever it changes
  useEffect(() => {
    try {
      if (expandedPostId) {
        localStorage.setItem('expandedPostId', JSON.stringify(expandedPostId));
        console.log('Saved expandedPostId to localStorage:', expandedPostId);
      } else {
        localStorage.removeItem('expandedPostId');
        console.log('Removed expandedPostId from localStorage');
      }
    } catch (error) {
      console.error('Error saving expanded post to localStorage:', error);
    }
  }, [expandedPostId]);

  // Save expandedPosts to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('expandedPosts', JSON.stringify(expandedPosts));
      console.log('Saved expandedPosts to localStorage:', expandedPosts);
    } catch (error) {
      console.error('Error saving expanded posts to localStorage:', error);
    }
  }, [expandedPosts]);

  // Initialize posts with expanded state from localStorage on component mount
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

  // Toggle comments visibility - ALLOWED for guests
  const toggleComments = (postId) => {
    const newExpandedPostId = expandedPostId === postId ? null : postId;
    console.log('Toggling comments for post:', postId, 'New expandedPostId:', newExpandedPostId);
    setExpandedPostId(newExpandedPostId);
  };

  // Handle comment voting - REQUIRES LOGIN
  const handleCommentVote = (commentId, voteType) => {
    promptLogin();
  };

  // Handle comment replies - REQUIRES LOGIN
  const handleCommentReply = (commentId, replyText) => {
    promptLogin();
  };

  // Handle post voting - REQUIRES LOGIN
  const handleVote = (postId, voteType) => {
    promptLogin();
  };

  // Handle adding comment - REQUIRES LOGIN
  const handleAddComment = (postId) => {
    promptLogin();
  };

  // Handle comment input change - ALLOWED but will require login to submit
  const handleCommentInputChange = (postId, value) => {
    // Allow typing but will prompt login on submit
  };

  const promptLogin = () => {
    alert("Please log in to continue");
    // You can also use: onLogin(); if you have a login function prop
  };

  const toggleViewMode = () => {
    setViewMode(prev => {
      const newViewMode = prev === 'card' ? 'compact' : 'card';
      console.log('Toggling view mode to:', newViewMode);
      return newViewMode;
    });
  };


  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  };

  // Function to get the appropriate thumbnail image for posts
  const getThumbnailImage = (post) => {
    if (post.image) {
      return post.image;
    }
    return darkMode ? "/compact-image-dark.png" : "/compact-image.png";
  };

  // Add toggleExpand function with localStorage persistence
  const toggleExpand = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const newExpandedState = !post.isExpanded;
          
          // Update expandedPosts array in state
          setExpandedPosts(prev => {
            if (newExpandedState) {
              // Add to expanded posts if not already there
              return prev.includes(postId) ? prev : [...prev, postId];
            } else {
              // Remove from expanded posts
              return prev.filter(id => id !== postId);
            }
          });
          
          return { ...post, isExpanded: newExpandedState };
        }
        return post;
      })
    );
  };

  const handleUpvote = (postId, e) => {
    e.stopPropagation();
    promptLogin();
  };

  const handleDownvote = (postId, e) => {
    e.stopPropagation();
    promptLogin();
  };

  const handlePostClick = (postId) => {
    // Guests can view posts but might need login for full features
    console.log(`Guest viewing post ${postId}`);
  };

  // Handle hide post (for guest - will prompt login)
  const handleHidePost = (postId, e) => {
    e?.stopPropagation();
    promptLogin();
  };

  return (
    <div className="page-container">
      <LeftSidebar darkMode={darkMode} />
      
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
        {/*post */}
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
        <PopularCommunities communities={popularCommunities} darkMode={darkMode} />
      </div>

      {/* Footer Text */}
      <div className="footer-text">
        <p className="footer-line">Reddit Rules    Privacy Policy    User Agreement</p>
        <p className="footer-copyright">Reddit, Inc. © 2025. All rights reserved.</p>
      </div>
    </div>
  );
}