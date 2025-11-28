// pages/HomePage/HomePage.jsx
import React, { useState, useEffect } from "react";
import { 
  FaPlus, FaBell, FaUser, FaCog, FaSignOutAlt, 
  FaHome, FaFire, FaStar, FaRegBookmark, FaShare, FaEllipsisH, FaEyeSlash,
  FaArrowUp, FaRegCommentAlt ,FaFlag
} from "react-icons/fa";
import "./HomePage.css";
import "../../components/PostCard/PostCard.css";
import { FaExpand, FaCompress } from "react-icons/fa";
import Comment from "../../components/Comment/Comment";
import TrendingPosts from "../../components/TrendingPosts/TrendingPosts";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";

const HomePage = ({ user, onLogout, darkMode }) => {
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

  // Initialize sortBy from localStorage
  const [sortBy, setSortBy] = useState(() => {
    try {
      const savedSortBy = localStorage.getItem('sortBy');
      const sortOptions = ["Best", "Hot", "New", "Top", "Rising"];
      return sortOptions.includes(savedSortBy) ? savedSortBy : 'Best';
    } catch (error) {
      console.error('Error loading sort by from localStorage:', error);
      return 'Best';
    }
  });

  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [joined, setJoined] = useState(false);

  // Initialize expandedPostId from localStorage
  const [expandedPostId, setExpandedPostId] = useState(() => {
    try {
      const savedExpandedPostId = localStorage.getItem('expandedPostId');
      if (savedExpandedPostId) {
        const parsedId = JSON.parse(savedExpandedPostId);
        console.log('Loaded expandedPostId from localStorage:', parsedId);
        // Only return if it's a valid number (post ID)
        return typeof parsedId === 'number' ? parsedId : null;
      }
    } catch (error) {
      console.error('Error loading expanded post from localStorage:', error);
    }
    return null;
  });

  // Initialize expandedPosts (for compact view) from localStorage
  const [expandedPosts, setExpandedPosts] = useState(() => {
    try {
      const savedExpandedPosts = localStorage.getItem('expandedPosts');
      if (savedExpandedPosts) {
        const parsedPosts = JSON.parse(savedExpandedPosts);
        return Array.isArray(parsedPosts) ? parsedPosts : [];
      }
    } catch (error) {
      console.error('Error loading expanded posts from localStorage:', error);
    }
    return [];
  });

  // Initialize joinedCommunities from localStorage
  const [joinedCommunities, setJoinedCommunities] = useState(() => {
    try {
      const savedJoinedCommunities = localStorage.getItem('joinedCommunities');
      if (savedJoinedCommunities) {
        const parsedCommunities = JSON.parse(savedJoinedCommunities);
        return typeof parsedCommunities === 'object' ? parsedCommunities : {};
      }
    } catch (error) {
      console.error('Error loading joined communities from localStorage:', error);
    }
    return {};
  });

  // Initialize hiddenPosts from localStorage
  const [hiddenPosts, setHiddenPosts] = useState(() => {
    try {
      const savedHiddenPosts = localStorage.getItem('hiddenPosts');
      if (savedHiddenPosts) {
        const parsedHiddenPosts = JSON.parse(savedHiddenPosts);
        return Array.isArray(parsedHiddenPosts) ? parsedHiddenPosts : [];
      }
    } catch (error) {
      console.error('Error loading hidden posts from localStorage:', error);
    }
    return [];
  });

  // Initialize recentPosts from localStorage with proper error handling
  const [recentPosts, setRecentPosts] = useState(() => {
    try {
      const savedRecentPosts = localStorage.getItem('recentPosts');
      if (savedRecentPosts) {
        const parsedPosts = JSON.parse(savedRecentPosts);
        // Ensure we have valid posts with required properties
        return Array.isArray(parsedPosts) ? parsedPosts : [];
      }
    } catch (error) {
      console.error('Error loading recent posts from localStorage:', error);
    }
    return [];
  });

  // Helper function to apply comment votes recursively
  const applyCommentVotes = (comments, commentVotes) => {
    return comments.map(comment => {
      const savedVote = commentVotes[comment.id];
      const updatedComment = {
        ...comment,
        userVote: savedVote !== undefined ? savedVote : comment.userVote,
        upvotes: savedVote !== undefined ? comment.upvotes + savedVote : comment.upvotes
      };

      // Apply to replies recursively
      if (comment.replies && comment.replies.length > 0) {
        updatedComment.replies = applyCommentVotes(comment.replies, commentVotes);
      }

      return updatedComment;
    });
  };

  const [posts, setPosts] = useState(() => {
    const defaultPosts = [
      { 
        id: 1,
        community: "programming", 
        user: "dev_guru", 
        userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        title: "Just launched my new React project - would love feedback!", 
        content: "After 6 months of development, I've finally launched my React-based project management tool. Built with TypeScript, Redux, and Styled Components.",
        upvotes: 1242, 
        comments: 89,
        time: "2 hours ago",
        userVote: 0,
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        isExpanded: false, // This will be overridden by expandedPosts
        commentsList: [
          {
            id: 1,
            author: "react_master",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            content: "This looks amazing! Can you share the repo?",
            upvotes: 234,
            userVote: 0,
            time: "1 hour ago",
            replies: [
              {
                id: 2,
                author: "dev_guru",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                content: "Sure! Here's the GitHub link: github.com/devguru/project",
                upvotes: 89,
                userVote: 0,
                time: "45 min ago",
                replies: []
              }
            ]
          },
          {
            id: 3,
            author: "css_lover",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            content: "The UI is so clean! What did you use for styling?",
            upvotes: 156,
            userVote: 0,
            time: "30 min ago",
            replies: []
          }
        ]
      },
      { 
        id: 2,
        community: "reactjs", 
        user: "react_fan", 
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        title: "React 19 features we're all excited about", 
        content: "The React team has been teasing some amazing features for the next major release. Here's what we know so far...",
        upvotes: 856, 
        comments: 234,
        time: "5 hours ago",
        userVote: 0,
        image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        isExpanded: false, // This will be overridden by expandedPosts
        commentsList: [
          {
            id: 4,
            author: "web_dev",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            content: "The compiler optimizations sound promising! Can't wait to see the performance improvements.",
            upvotes: 42,
            userVote: 0,
            time: "3 hours ago",
            replies: []
          }
        ]
      },
      { 
        id: 3,
        community: "webdev", 
        user: "css_wizard", 
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        title: "CSS Grid vs Flexbox: When to use which?", 
        content: "A comprehensive guide to help you decide when to reach for Grid and when Flexbox is the better choice for your layout needs.",
        upvotes: 421, 
        comments: 67,
        time: "1 day ago",
        userVote: 0,
        image: null,
        isExpanded: false, // This will be overridden by expandedPosts
        commentsList: []
      },
      // User's own post
      { 
        id: 4,
        community: null, 
        user: user?.username || "current_user", 
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        title: "My first React component - looking for code review!", 
        content: "I've been learning React for a few weeks and just built my first custom component. It's a reusable modal that handles animations and accessibility. Would appreciate any feedback on the code structure and best practices!",
        upvotes: 42, 
        comments: 8,
        time: "30 minutes ago",
        userVote: 0, // Changed from 1 to 0 to allow loading from localStorage
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        isExpanded: false, // This will be overridden by expandedPosts
        isUserPost: true,
        commentsList: [
          {
            id: 5,
            author: "senior_dev",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            content: "Great start! The component structure looks clean. One suggestion: consider using React Portals for the modal to avoid z-index issues.",
            upvotes: 15,
            userVote: 0,
            time: "15 minutes ago",
            replies: [
              {
                id: 6,
                author: user?.username || "current_user",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
                content: "Thanks for the tip! I'll look into React Portals - that sounds like a better approach.",
                upvotes: 3,
                userVote: 0,
                time: "5 minutes ago",
                replies: []
              }
            ]
          }
        ]
      }
    ];

    try {
      const savedPostVotes = localStorage.getItem('postVotes');
      const savedCommentVotes = localStorage.getItem('commentVotes');
      const savedExpandedPosts = localStorage.getItem('expandedPosts');
      
      // Apply saved expanded posts state
      let postsWithExpandedState = defaultPosts;
      if (savedExpandedPosts) {
        const expandedPostIds = JSON.parse(savedExpandedPosts);
        postsWithExpandedState = defaultPosts.map(post => ({
          ...post,
          isExpanded: expandedPostIds.includes(post.id)
        }));
      }

      if (savedPostVotes || savedCommentVotes) {
        const postVotes = savedPostVotes ? JSON.parse(savedPostVotes) : {};
        const commentVotes = savedCommentVotes ? JSON.parse(savedCommentVotes) : {};

        // Apply saved post votes
        const updatedPosts = postsWithExpandedState.map(post => {
          const savedVote = postVotes[post.id];
          if (savedVote !== undefined) {
            return {
              ...post,
              userVote: savedVote,
              upvotes: post.upvotes + savedVote // Adjust upvotes based on saved vote
            };
          }
          return post;
        });

        // Apply saved comment votes recursively
        return updatedPosts.map(post => ({
          ...post,
          commentsList: applyCommentVotes(post.commentsList, commentVotes)
        }));
      }

      return postsWithExpandedState;
    } catch (error) {
      console.error('Error loading votes from localStorage:', error);
    }

    return defaultPosts;
  });

  const sortOptions = ["Best", "Hot", "New", "Top", "Rising"];

  // Save viewMode to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('viewMode', viewMode);
      console.log('Saved viewMode to localStorage:', viewMode);
    } catch (error) {
      console.error('Error saving view mode to localStorage:', error);
    }
  }, [viewMode]);

  // Save sortBy to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('sortBy', sortBy);
      console.log('Saved sortBy to localStorage:', sortBy);
    } catch (error) {
      console.error('Error saving sort by to localStorage:', error);
    }
  }, [sortBy]);

  // Save expandedPostId to localStorage whenever it changes
  useEffect(() => {
    try {
      if (expandedPostId) {
        localStorage.setItem('expandedPostId', JSON.stringify(expandedPostId));
        console.log('Saved expandedPostId to localStorage:', expandedPostId);
      } else {
        // If no post is expanded, remove it from localStorage
        localStorage.removeItem('expandedPostId');
        console.log('Removed expandedPostId from localStorage');
      }
    } catch (error) {
      console.error('Error saving expanded post to localStorage:', error);
    }
  }, [expandedPostId]);

  // Save expandedPosts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('expandedPosts', JSON.stringify(expandedPosts));
      console.log('Saved expandedPosts to localStorage:', expandedPosts);
    } catch (error) {
      console.error('Error saving expanded posts to localStorage:', error);
    }
  }, [expandedPosts]);
  
  // Save post votes to localStorage whenever posts change
  useEffect(() => {
    try {
      const postVotes = {};
      const commentVotes = {};

      // Extract post votes
      posts.forEach(post => {
        if (post.userVote !== 0) {
          postVotes[post.id] = post.userVote;
        }
      });

      // Extract comment votes recursively
      const extractCommentVotes = (comments) => {
        comments.forEach(comment => {
          if (comment.userVote !== 0) {
            commentVotes[comment.id] = comment.userVote;
          }
          if (comment.replies && comment.replies.length > 0) {
            extractCommentVotes(comment.replies);
          }
        });
      };

      posts.forEach(post => {
        extractCommentVotes(post.commentsList);
      });

      localStorage.setItem('postVotes', JSON.stringify(postVotes));
      localStorage.setItem('commentVotes', JSON.stringify(commentVotes));
    } catch (error) {
      console.error('Error saving votes to localStorage:', error);
    }
  }, [posts]);

  // Save recent posts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('recentPosts', JSON.stringify(recentPosts));
    } catch (error) {
      console.error('Error saving recent posts to localStorage:', error);
    }
  }, [recentPosts]);

  // Save hiddenPosts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('hiddenPosts', JSON.stringify(hiddenPosts));
    } catch (error) {
      console.error('Error saving hidden posts to localStorage:', error);
    }
  }, [hiddenPosts]);

  // Save joinedCommunities to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('joinedCommunities', JSON.stringify(joinedCommunities));
    } catch (error) {
      console.error('Error saving joined communities to localStorage:', error);
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
      userAvatar: post.userAvatar || "/profile.png",
      timestamp: Date.now(), // Add timestamp for sorting
      time: post.time
    };

    setRecentPosts(prev => {
      // Remove if already exists (to avoid duplicates)
      const filtered = prev.filter(p => p.id !== post.id);
      // Add to beginning and limit to 5 posts
      const updated = [recentPost, ...filtered].slice(0, 5);
      return updated;
    });
  };

  // Function to clear all recent posts
  const clearRecentPosts = () => {
    setRecentPosts([]);
    // Also clear from localStorage
    localStorage.removeItem('recentPosts');
  };

  // Handle post click - add to recent posts
  const handlePostClick = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      addToRecentPosts(post);
    }
    console.log(`Opening post details for post ${postId}`);
  };

  // Function to format relative time
  const formatRelativeTime = (timeString) => {
    if (!timeString) return '';
    
    let formattedTime = timeString.toLowerCase();
    
    // Replace common time patterns with abbreviated versions
    formattedTime = formattedTime
      .replace(/(\d+)\s+minutes?\s+ago/, '$1m')
      .replace(/(\d+)\s+min\s+ago/, '$1m')
      .replace(/(\d+)\s+hours?\s+ago/, '$1h')
      .replace(/(\d+)\s+days?\s+ago/, '$1d')
      .replace(/(\d+)\s+weeks?\s+ago/, '$1w')
      .replace(/(\d+)\s+months?\s+ago/, '$1mo')
      .replace(/(\d+)\s+years?\s+ago/, '$1y')
      .replace(/\s+ago/, '');

    return formattedTime;
  };

  // Handle hiding a post
  const handleHidePost = (postId, e) => {
    e?.stopPropagation();
    setHiddenPosts(prev => {
      const updated = [...prev, postId];
      return updated;
    });
  };

  // Handle unhiding a post
  const handleUnhidePost = (postId, e) => {
    e?.stopPropagation();
    setHiddenPosts(prev => prev.filter(id => id !== postId));
  };

  // Handle community join toggle
  const handleJoinCommunity = (communityName, e) => {
    e?.stopPropagation();
    setJoinedCommunities(prev => ({
      ...prev,
      [communityName]: !prev[communityName]
    }));
  };

  // Function to get thumbnail for recent posts
  const getRecentPostThumbnail = (post) => {
    if (post.image) {
      return post.image;
    }
    return darkMode ? "/compact-image-dark.png" : "/compact-image.png";
  };

  // Handle comment voting
  const handleCommentVote = (commentId, voteType) => {
    setPosts(prevPosts =>
      prevPosts.map(post => ({
        ...post,
        commentsList: updateCommentVote(post.commentsList, commentId, voteType)
      }))
    );
  };

  // Helper function to update comment votes (recursive for nested comments)
  const updateCommentVote = (comments, commentId, voteType) => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        let newUpvotes = comment.upvotes;
        let newUserVote = voteType;
        
        // If clicking the same vote again, remove the vote
        if (comment.userVote === voteType) {
          newUserVote = 0;
          newUpvotes -= voteType;
        } 
        // If changing vote
        else if (comment.userVote !== 0) {
          newUpvotes = newUpvotes - comment.userVote + voteType;
        }
        // If new vote
        else {
          newUpvotes += voteType;
        }
        
        return {
          ...comment,
          upvotes: newUpvotes,
          userVote: newUserVote
        };
      }
      
      // Recursively update replies
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentVote(comment.replies, commentId, voteType)
        };
      }
      
      return comment;
    });
  };

  // Handle comment replies
  const handleCommentReply = (commentId, replyText) => {
    setPosts(prevPosts =>
      prevPosts.map(post => ({
        ...post,
        commentsList: addCommentReply(post.commentsList, commentId, replyText)
      }))
    );
  };

  // Helper function to add reply to comment (recursive for nested comments)
  const addCommentReply = (comments, commentId, replyText) => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        const newReply = {
          id: Date.now(),
          author: user?.username || "Anonymous",
          avatar: user?.avatar || "/profile.png",
          content: replyText,
          upvotes: 1,
          userVote: 0,
          time: "Just now",
          replies: []
        };
        
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      }
      
      // Recursively search in replies
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: addCommentReply(comment.replies, commentId, replyText)
        };
      }
      
      return comment;
    });
  };

  // Toggle comments visibility
  const toggleComments = (postId) => {
    const newExpandedPostId = expandedPostId === postId ? null : postId;
    console.log('Toggling comments for post:', postId, 'New expandedPostId:', newExpandedPostId);
    setExpandedPostId(newExpandedPostId);
  };

  // Handle comment input change
  const handleCommentInputChange = (postId, value) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  // Add a new comment
  const handleAddComment = (postId) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    const newComment = {
      id: Date.now(),
      author: user?.username || "Anonymous",
      avatar: user?.avatar || "/profile.png",
      content: commentText,
      upvotes: 1,
      userVote: 0,
      time: "Just now",
      replies: []
    };

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments + 1,
              commentsList: [...post.commentsList, newComment]
            }
          : post
      )
    );

    // Clear the input
    setCommentInputs(prev => ({
      ...prev,
      [postId]: ""
    }));
  };

  // Add toggleExpand function for compact view
  const toggleExpand = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, isExpanded: !post.isExpanded }
          : post
      )
    );

    // Update the expandedPosts state for persistence
    setExpandedPosts(prev => {
      if (prev.includes(postId)) {
        // Remove from expanded posts if it's already there (collapsing)
        return prev.filter(id => id !== postId);
      } else {
        // Add to expanded posts (expanding)
        return [...prev, postId];
      }
    });
  };

  // Handle post voting
  const handleVote = (postId, voteType) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          let newUpvotes = post.upvotes;
          let newUserVote = voteType;
          
          // If clicking the same vote again, remove the vote
          if (post.userVote === voteType) {
            newUserVote = 0;
            newUpvotes -= voteType;
          } 
          // If changing vote
          else if (post.userVote !== 0) {
            newUpvotes = newUpvotes - post.userVote + voteType;
          }
          // If new vote
          else {
            newUpvotes += voteType;
          }
          
          return {
            ...post,
            upvotes: newUpvotes,
            userVote: newUserVote
          };
        }
        return post;
      })
    );
  };

  // Function to get thumbnail image for compact view
  const getThumbnailImage = (post) => {
    if (post.image) {
      return post.image;
    }
    return darkMode ? "/compact-image-dark.png" : "/compact-image.png";
  };

  const handleUpvote = (postId, e) => {
    e.stopPropagation();
    handleVote(postId, 1);
  };

  const handleDownvote = (postId, e) => {
    e.stopPropagation();
    handleVote(postId, -1);
  };

  const toggleViewMode = () => {
    setViewMode(prev => {
      const newViewMode = prev === 'card' ? 'compact' : 'card';
      console.log('Toggling view mode to:', newViewMode);
      return newViewMode;
    });
  };

  const toggleSortDropdown = () => {
    setShowSortDropdown(prev => !prev);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(prev => !prev);
  };

  const handleSortSelect = (option) => {
    console.log('Selected sort option:', option);
    setSortBy(option);
    setShowSortDropdown(false);
  };

  const handleCommunityClick = (communityName) => {
    console.log(`Opening community page for r/${communityName}`);
  };

  const handleCreatePost = () => {
    console.log("Create new post");
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  };
  
  return (
    <div className="page-container">
      {/* Use LeftSidebar component with start community button */}
      <LeftSidebar darkMode={darkMode} showStartCommunity={true} />

      {/* Main Feed */}
      <div className="main-feed">
        <div className="feed-controls">
          <div className="sort-options">
            {/* Sort Dropdown */}
            <div className="sort-dropdown-container">
              <button className="sort-btn active" onClick={toggleSortDropdown}>
                <span>{sortBy}</span>
                <svg className={`dropdown-icon ${showSortDropdown ? 'open' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {showSortDropdown && (
                <div className="sort-dropdown">
                  <div className="dropdown-list">
                    {sortOptions.map((option, index) => (
                      <button
                        key={index}
                        className={`dropdown-item ${sortBy === option ? 'active' : ''}`}
                        onClick={() => handleSortSelect(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* View Toggle */}
            <button className="view-toggle-btn" onClick={toggleViewMode}>
              {viewMode === 'card' ? '☐' : '≡'}
            </button>
          </div>
        </div>

        {/* Posts */}
          <TrendingPosts
            posts={posts}
            viewMode={viewMode}
            darkMode={darkMode}
            onVote={handleVote}
            formatNumber={formatNumber}
            onToggleComments={toggleComments}
            onPostClick={handlePostClick}
            onJoinCommunity={handleJoinCommunity}
            joinedCommunities={joinedCommunities}
            expandedPostId={expandedPostId}
            commentInputs={commentInputs}
            onCommentInputChange={handleCommentInputChange}
            onAddComment={handleAddComment}
            onHidePost={handleHidePost}
            onUnhidePost={handleUnhidePost}
            hiddenPosts={hiddenPosts}
            onUpvote={handleUpvote}
            onDownvote={handleDownvote}
            onCommentVote={handleCommentVote}
            onCommentReply={handleCommentReply}
            getThumbnailImage={getThumbnailImage}
            toggleExpand={toggleExpand}
            isGuest={false}
            recentPosts={recentPosts}
            onClearRecentPosts={clearRecentPosts}
            showRecentPosts={true}
          />
      </div>

      {/* Right Sidebar */}
      <div className="sidebar">
        {/* Recent Posts Section - Only show if there are recent posts */}
        {recentPosts.length > 0 && (
          <div className="recent-posts-box">
            <div className="recent-posts-header">
              <h3>RECENT POSTS</h3>
              <button 
                className="clear-recent-btn"
                onClick={clearRecentPosts}
                title="Clear all recent posts"
              >
                Clear
              </button>
            </div>
            
            <div className="recent-posts-list">
              {recentPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="recent-post-item"
                  onClick={() => handlePostClick(post.id)}
                >
                  <div className="recent-post-thumbnail">
                    {post.image ? (
                      <img 
                        src={getRecentPostThumbnail(post)} 
                        alt={post.title}
                      />
                    ) : (
                      <div className="default-thumbnail">
                        📝
                      </div>
                    )}
                  </div>
                  
                  <div className="recent-post-content">
                    {/* New header with user avatar, community, and time */}
                    <div className="recent-post-header">
                      <img 
                        src={post.userAvatar} 
                        alt={post.user}
                        className="recent-post-user-avatar"
                      />
                      <span 
                        className="recent-post-community"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCommunityClick(post.community);
                        }}
                      >
                        r/{post.community}
                      </span>
                      <span className="recent-post-divider">•</span>
                      <span className="recent-post-time">
                        {formatRelativeTime(post.time)}
                      </span>
                    </div>
                    
                    <div className="recent-post-title">
                      {post.title}
                    </div>
                    <div className="recent-post-stats">
                      <div className="recent-post-stat">
                        <FaArrowUp className="icon" />
                        <span>{formatNumber(post.upvotes)}</span>
                      </div>
                      <div className="recent-post-stat">
                        <FaRegCommentAlt className="icon" />
                        <span>{formatNumber(post.comments)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Text */}
      <div className="footer-text">
        <p className="footer-line">Reddit Rules    Privacy Policy    User Agreement</p>
        <p className="footer-copyright">Reddit, Inc. © 2025. All rights reserved.</p>
      </div>
    </div>
  );
};

export default HomePage;