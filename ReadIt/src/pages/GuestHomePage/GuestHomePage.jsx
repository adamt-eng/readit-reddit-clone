// pages/GuestHomePage/GuestHomePage.jsx
import React, { useState } from "react";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import TrendingPosts from "../../components/TrendingPosts/TrendingPosts";
import PopularCommunities from "../../components/PopularCommunities/PopularCommunities";
import { FaRegCommentAlt, FaShare, FaBookmark, FaEllipsisH } from "react-icons/fa";
import "./GuestHomePage.css";
import { FaExpand, FaCompress } from "react-icons/fa";
import Comment from "../../components/Comment/Comment";

export default function GuestHomePage({ darkMode, onLogin }) {
  const [viewMode, setViewMode] = useState('card');
  const [sortBy, setSortBy] = useState('Best');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null); // Track which post has comments expanded
  const [posts, setPosts] = useState([
    { 
      id: 1,
      community: "news", 
      user: "newsbot", 
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
          avatar: "/profile.png",
          content: "This is such an important development. Hope they reach a peaceful resolution soon.",
          upvotes: 45,
          userVote: 0,
          time: "2 hours ago",
          replies: [
            {
              id: 2,
              author: "politics_nerd",
              avatar: "/profile.png",
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
          avatar: "/profile.png",
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
          avatar: "/profile.png",
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
      title: "Wicked Part 2 box office projections exceed expectations", 
      content: "Early box office projections for Wicked Part 2 are surpassing industry expectations, with pre-sales breaking records.",
      upvotes: 200, 
      comments: 33,
      time: "1 day ago",
      userVote: 0,
      image: null,
      isExpanded: false,
      commentsList: []
    }
  ]);

  const popularCommunities = [
    { name: "AskMen", members: "888,675" },
    { name: "AskWomen", members: "5,360,108" },
    { name: "PS4", members: "5,507,926" },
    { name: "apple", members: "6,263,518" },
    { name: "NBA2k", members: "78,031" }
  ];


  const sortOptions = [
    "Best",
    "Hot",
    "New",
    "Top",
    "Rising"
  ];

  // Toggle comments visibility - ALLOWED for guests
  const toggleComments = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
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
    setViewMode(prevMode => prevMode === 'card' ? 'compact' : 'card');
  };

  const toggleLocationDropdown = () => {
    setShowLocationDropdown(prev => !prev);
    setShowSortDropdown(false);
  };

  const toggleSortDropdown = () => {
    setShowSortDropdown(prev => !prev);
  };

  const handleSortSelect = (sortOption) => {
    setSortBy(sortOption);
    setShowSortDropdown(false);
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

  // Add toggleExpand function
  const toggleExpand = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, isExpanded: !post.isExpanded }
          : post
      )
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

  const handleCommunityClick = (communityName) => {
    console.log(`Guest viewing community r/${communityName}`);
  };

  return (
    <div className="page-container">
      <LeftSidebar darkMode={darkMode} />
      
      <div className="main-feed">
        <div className="feed-controls">
          <div className="sort-options">
            {/* Sort Dropdown */}
            <div className="sort-dropdown-container">
              <button 
                className="sort-btn active"
                onClick={toggleSortDropdown}
              >
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
            
            <button 
              className="view-toggle-btn" 
              onClick={toggleViewMode}
              title={`Current: ${viewMode} view`}
            >
              {viewMode === 'card' ? '☐' : '≡'}
            </button>
          </div>
        </div>
        <div className={`posts-container ${viewMode}-view`}>
          {posts.map((post) => (
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
                  <span className="community">r/{post.community}</span>
                  <span className="divider">•</span>
                  <span className="user">Posted by u/{post.user}</span>
                  <span className="divider">•</span>
                  <span className="time">{post.time}</span>
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
                  
                  <button onClick={promptLogin} className="post-action-btn">
                    <FaBookmark className="action-icon" />
                    <span className="action-text">Save</span>
                  </button>
                  
                </div>

                {/* COMMENTS SECTION - Guests can VIEW comments but not interact */}
                {expandedPostId === post.id && (
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
          ))}
        </div>
      </div>

      <div className="sidebar">
        <PopularCommunities communities={popularCommunities} darkMode={darkMode} />
      </div>
    </div>
  );
}