// pages/GuestHomePage/GuestHomePage.jsx
import React, { useState, useEffect } from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import PopularCommunities from "../../components/PopularCommunities/PopularCommunities";
import { FaRegCommentAlt, FaShare, FaBookmark, FaEllipsisH, FaFlag  } from "react-icons/fa";
import "./GuestHomePage.css";
import { FaExpand, FaCompress } from "react-icons/fa";
import Comment from "../../components/Comment/Comment";

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
        <div className={`posts-container ${viewMode}-view`}>
          {posts.map((post) => {
            const isCommentsExpanded = expandedPostId === post.id;
            
            return (
              <div 
                key={post.id} 
                className={`post-card ${viewMode}-view`}
                onClick={() => handlePostClick(post.id)}
              >
                {/* Thumbnail for compact view - always show, with default image if needed */}
                {viewMode === 'compact' && (
                  <div className="post-thumbnail">
                    <img 
                      src={getThumbnailImage(post)} 
                      alt={post.image ? post.title : "Default post thumbnail"}
                      className={`thumbnail-image ${!post.image ? 'default-thumbnail' : ''}`}
                    />
                  </div>
                )}
              

                <div className="post-content">
                  {/* EXPAND BUTTON - Put this here */}
                  {viewMode === 'compact' && (post.image || post.content) && (
                    <button 
                      className="expand-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(post.id);
                      }}
                      title={post.isExpanded ? "Collapse" : "Expand"}
                    >
                      {post.isExpanded ? <FaCompress /> : <FaExpand />}
                    </button>
                  )}

                  <div className="post-meta">
                    <div className="post-meta-left">
                      <img 
                        src={post.userAvatar} 
                        alt={post.user}
                        className="user-avatar"
                      />
                      {post.community ? (
                        <>
                          <span className="community">r/{post.community}</span>
                          <span className="divider">•</span>
                        </>
                      ) : (
                        <>
                          <span className="community">u/{post.user}</span>
                          <span className="divider">•</span>
                        </>
                      )}
                      <span className="user">Posted by u/{post.user}</span>
                      <span className="divider">•</span>
                      <span className="time">{post.time}</span>
                    </div>

                    <div className="post-meta-right">
                      {/* Only show Join button for community posts */}
                      {post.community && (
                        <button 
                          className={`join-btn ${joinedCommunities[post.community] ? 'joined' : ''}`}
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            promptLogin();
                          }}
                        >
                          {joinedCommunities[post.community] ? 'Joined' : 'Join'}
                        </button>
                      )}

                      <div className="post-menu-wrapper" onClick={(e)=>e.stopPropagation()}>
                        <button className="post-menu-btn">
                          <FaEllipsisH />
                        </button>

                        <div className="post-menu-dropdown">
                          {/* Only show Report button with flag icon for all posts */}
                          <button className="menu-item flag-item" onClick={promptLogin}>
                            <FaFlag className="menu-icon" />
                            Report
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="post-title">{post.title}</h3>
                  {/* EXPANDED CONTENT - Put this here */}
                  {viewMode === 'compact' && post.isExpanded && (
                    <div className="expanded-content">
                      {post.image && (
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="expanded-image"
                        />
                      )}
                      {post.content && (
                        <div className="expanded-text">
                          {post.content}
                        </div>
                      )}
                    </div>
                  )}
                
                  {/* Full content and image for card view */}
                  {viewMode === 'card' && (
                    <>
                      {post.content && (
                        <div className="post-body">
                          {post.content}
                        </div>
                      )}
                      {post.image && (
                        <div className="post-image-container">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="post-image"
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div className="post-actions-bar" onClick={(e) => e.stopPropagation()}>
                    <div className={`vote-section ${post.userVote === 1 ? 'upvoted' : ''} ${post.userVote === -1 ? 'downvoted' : ''}`}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpvote(post.id, e);
                        }}
                        className="vote-btn upvote"
                        title="Upvote"
                      >
                        ⇧
                      </button>
                      <span className="vote-count">{formatNumber(post.upvotes)}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownvote(post.id, e);
                        }}
                        className="vote-btn downvote"
                        title="Downvote"
                      >
                        ⇩
                      </button>
                    </div>
                    
                    {/* Comments Button - ALLOWED for guests to view comments */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleComments(post.id);
                      }} 
                      className="post-action-btn comment-btn"
                    >
                      <FaRegCommentAlt className="action-icon" />
                      <span className="action-text">{formatNumber(post.comments)} Comments</span>
                    </button>
                    
                    <button onClick={promptLogin} className="post-action-btn">
                      <FaShare className="action-icon" />
                      <span className="action-text">Share</span>
                    </button>
                    
                  </div>

                  {/* COMMENTS SECTION - Guests can VIEW comments but not interact */}
                  {isCommentsExpanded && (
                    <div className="post-comments-section">
                      <div className="comments-header">
                        <h4>{post.commentsList.length} Comment{post.commentsList.length !== 1 ? 's' : ''}</h4>
                        <div className="guest-notice">
                          <small>💡 Log in to vote and comment</small>
                        </div>
                      </div>
                      
                      {/* Comments List - READ ONLY for guests */}
                      <div className="comments-list">
                        {post.commentsList.length > 0 ? (
                          post.commentsList.map(comment => (
                            <Comment 
                              key={comment.id} 
                              comment={comment} 
                              darkMode={darkMode}
                              onVote={handleCommentVote} // Will prompt login
                              onReply={handleCommentReply} // Will prompt login
                              postId={post.id}
                            />
                          ))
                        ) : (
                          <div className="no-comments">
                            No comments yet. <button onClick={promptLogin} className="login-prompt-btn">Log in</button> to be the first to share your thoughts!
                          </div>
                        )}
                      </div>

                      {/* Add Comment Section - Disabled for guests */}
                      <div className="add-comment guest-disabled">
                        <textarea 
                          placeholder="Log in to add a comment..." 
                          className="comment-input"
                          rows="3"
                          onClick={promptLogin}
                          readOnly
                        />
                        <div className="comment-actions-footer">
                          <button 
                            className="comment-btn guest-disabled-btn"
                            onClick={promptLogin}
                          >
                            Log in to Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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