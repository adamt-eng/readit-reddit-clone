// pages/HomePage/HomePage.jsx
import React, { useState } from "react";
import { 
  FaPlus, FaBell, FaUser, FaCog, FaSignOutAlt, 
  FaHome, FaFire, FaStar, FaRegBookmark, FaShare, FaEllipsisH 
} from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { FaRegCommentAlt } from "react-icons/fa";
import "./HomePage.css";
import { FaExpand, FaCompress } from "react-icons/fa";
import Comment from "../../components/Comment/Comment";

const HomePage = ({ user, onLogout, darkMode }) => {
  const [viewMode, setViewMode] = useState('card');
  const [sortBy, setSortBy] = useState('Best');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null); // Track which post has comments expanded
  const [commentInputs, setCommentInputs] = useState({}); // Track comment input for each post
  const [posts, setPosts] = useState([
    { 
      id: 1,
      community: "programming", 
      user: "dev_guru", 
      title: "Just launched my new React project - would love feedback!", 
      content: "After 6 months of development, I've finally launched my React-based project management tool. Built with TypeScript, Redux, and Styled Components.",
      upvotes: 1242, 
      comments: 89,
      time: "2 hours ago",
      userVote: 0,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isExpanded: false,
      commentsList: [
        {
          id: 1,
          author: "react_master",
          avatar: "/profile.png",
          content: "This looks amazing! Can you share the repo?",
          upvotes: 234,
          userVote: 1,
          time: "1 hour ago",
          replies: [
            {
              id: 2,
              author: "dev_guru",
              avatar: "/profile.png",
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
          avatar: "/profile.png",
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
      title: "React 19 features we're all excited about", 
      content: "The React team has been teasing some amazing features for the next major release. Here's what we know so far...",
      upvotes: 856, 
      comments: 234,
      time: "5 hours ago",
      userVote: 0,
      image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isExpanded: false,
      commentsList: [
        {
          id: 4,
          author: "web_dev",
          avatar: "/profile.png",
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
      title: "CSS Grid vs Flexbox: When to use which?", 
      content: "A comprehensive guide to help you decide when to reach for Grid and when Flexbox is the better choice for your layout needs.",
      upvotes: 421, 
      comments: 67,
      time: "1 day ago",
      userVote: 0,
      image: null,
      isExpanded: false,
      commentsList: []
    }
  ]);

  const userCommunities = [
    { name: "programming", members: "4.3M", isMember: true },
    { name: "reactjs", members: "289K", isMember: true },
    { name: "webdev", members: "1.2M", isMember: true },
    { name: "javascript", members: "2.1M", isMember: true },
    { name: "Design", members: "5.7M", isMember: true }
  ];

  const sortOptions = ["Best", "Hot", "New", "Top", "Rising"];

  // In HomePage.jsx - Add these functions

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
    setExpandedPostId(expandedPostId === postId ? null : postId);
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
    e.stopPropagation(); // Prevent post click when voting
    handleVote(postId, 1);
  };

  const handleDownvote = (postId, e) => {
    e.stopPropagation(); // Prevent post click when voting
    handleVote(postId, -1);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'card' ? 'compact' : 'card');
  };

  const toggleSortDropdown = () => {
    setShowSortDropdown(prev => !prev);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(prev => !prev);
  };

  const handleSortSelect = (option) => {
    setSortBy(option);
    setShowSortDropdown(false);
  };

  const handlePostClick = (postId) => {
    console.log(`Opening post details for post ${postId}`);
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
      {/* Left Sidebar - User's Communities */}
      <div className="left-sidebar">
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-item active">
              <FaHome className="nav-icon" />
              <span>Home</span>
            </div>
            <div className="nav-item">
              <FaFire className="nav-icon" />
              <span>Popular</span>
            </div>
          </div>

          <div className="nav-section">
            <div className="communities-header">
              <h4>YOUR COMMUNITIES</h4>
              <button className="create-community-btn" title="Create Community">
                <FaPlus />
              </button>
            </div>
            {userCommunities.map((community, index) => (
              <div 
                key={index} 
                className="nav-item community-item"
                onClick={() => handleCommunityClick(community.name)}
              >
                <HiUserGroup className="nav-icon" />
                <span>r/{community.name}</span>
              </div>
            ))}
            <div className="nav-item view-all-btn">
              <span>View All</span>
            </div>
          </div>

          <div className="nav-section">
            <h4>FEEDS</h4>
            <div className="nav-item">
              <FaStar className="nav-icon" />
              <span>Recently Visited</span>
            </div>
          </div>
        </nav>
      </div>

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

          {/* Create Post Button */}
          <button className="create-post-btn" onClick={handleCreatePost}>
            Create Post
          </button>
        </div>

        {/* Posts */}
        <div className={`posts-container ${viewMode}-view`}>
          {posts.map((post) => (
            <div 
              key={post.id} 
              className={`post-card ${viewMode}-view`}
              onClick={() => handlePostClick(post.id)}
            >
              {/* Thumbnail for compact view */}
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
                {/* EXPAND BUTTON for compact view */}
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
                  <span 
                    className="community" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCommunityClick(post.community);
                    }}
                  >
                    r/{post.community}
                  </span>
                  <span className="divider">•</span>
                  <span className="user">Posted by u/{post.user}</span>
                  <span className="divider">•</span>
                  <span className="time">{post.time}</span>
                </div>

                <h3 className="post-title">{post.title}</h3>
                
                {/* EXPANDED CONTENT for compact view */}
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
                      <div className="post-body">{post.content}</div>
                    )}
                    {post.image && (
                      <div className="post-image-container">
                        <img src={post.image} alt={post.title} className="post-image" />
                      </div>
                    )}
                  </>
                )}

                <div className="post-actions-bar" onClick={(e) => e.stopPropagation()}>
                  <div className={`vote-section ${post.userVote === 1 ? 'upvoted' : ''} ${post.userVote === -1 ? 'downvoted' : ''}`}>
                    <button 
                      onClick={(e) => handleUpvote(post.id, e)}
                      className="vote-btn upvote"
                      title="Upvote"
                    >
                      ⇧
                    </button>
                    <span className="vote-count">{formatNumber(post.upvotes)}</span>
                    <button 
                      onClick={(e) => handleDownvote(post.id, e)}
                      className="vote-btn downvote"
                      title="Downvote"
                    >
                      ⇩
                    </button>
                  </div>
                  
                  {/* SINGLE COMMENT BUTTON - Fixed duplicate */}
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
                  
                  <button className="post-action-btn">
                    <FaShare className="action-icon" />
                    <span className="action-text">Share</span>
                  </button>
                  
                  <button className="post-action-btn">
                    <FaRegBookmark className="action-icon" />
                    <span className="action-text">Save</span>
                  </button>
                  
                </div>

                {/* COMMENTS SECTION - Show in both card view and compact view when expanded */}
                {expandedPostId === post.id && (
                  <div className="post-comments-section">
                    <div className="comments-header">
                      <h4>{post.commentsList.length} Comment{post.commentsList.length !== 1 ? 's' : ''}</h4>
                    </div>
                    
                    {/* Comments List */}
                    <div className="comments-list">
                      {post.commentsList.length > 0 ? (
                        post.commentsList.map(comment => (
                          <Comment 
                            key={comment.id} 
                            comment={comment} 
                            darkMode={darkMode}
                            onVote={handleCommentVote}
                            onReply={handleCommentReply}
                            postId={post.id}
                          />
                        ))
                      ) : (
                        <div className="no-comments">
                          No comments yet. Be the first to share your thoughts!
                        </div>
                      )}
                    </div>

                    {/* Add Comment Section */}
                    <div className="add-comment">
                      <textarea 
                        placeholder="What are your thoughts?" 
                        className="comment-input"
                        rows="3"
                        value={commentInputs[post.id] || ""}
                        onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="comment-actions-footer">
                        <button 
                          className="comment-btn"
                          onClick={() => handleAddComment(post.id)}
                          disabled={!commentInputs[post.id]?.trim()}
                        >
                          Comment
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

      {/* Right Sidebar */}
      <div className="sidebar">
        <div className="community-box">
          <div className="community-header">
            <h3>PREMIUM</h3>
          </div>
          <div className="premium-content">
            <p>Reddit Premium gives you an ad-free experience and other special benefits.</p>
            <button className="premium-btn">Try Now</button>
          </div>
        </div>

        <div className="community-box">
          <div className="community-header">
            <h3>REDDIT RECOMMENDS</h3>
          </div>
          <div className="community-list">
            {userCommunities.slice(0, 3).map((community, i) => (
              <div 
                key={i} 
                className="community-item"
                onClick={() => handleCommunityClick(community.name)}
              >
                <HiUserGroup className="community-icon" />
                <div className="community-info">
                  <span className="community-name">r/{community.name}</span>
                  <small className="community-members">{community.members} members</small>
                </div>
                <button className="join-btn">Join</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;