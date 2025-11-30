import React, { useState } from "react";
import "./SearchResults.css";
import dummyData from "../../data/dummyData";

export default function SearchResults() {
  const [activeTab, setActiveTab] = useState("Posts");

  return (
    <div className="sr-wrapper">

      {/* Tabs */}
      <div className="sr-tabs">
        {["Posts", "Communities", "Comments", "Media", "People"].map(t => (
          <button
            key={t}
            className={`sr-tab ${activeTab === t ? "active" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="sr-filters">
        <div className="filter-dropdown">Relevance ▾</div>
        <div className="filter-dropdown">All time ▾</div>
      </div>

      <div className="sr-content-container">
        
        <div className="sr-left-column">
          {activeTab === "Posts" &&
            dummyData.posts.map(p => (
              <SearchPost key={p.id} post={p} />
            ))
          }

          {activeTab === "Communities" &&
            dummyData.communities.map(c => (
              <SearchCommunity key={c.id} comm={c} />
            ))
          }

          {activeTab === "People" &&
            dummyData.users.map(u => (
              <SearchUser key={u.id} user={u} />
            ))
          }
        </div>

        <div className="sr-right-column">
          <div className="sr-card">
            <h3>Communities</h3>
            {dummyData.communities.slice(0, 5).map(c => (
              <div key={c.id} className="sr-side-item">
                <img
                  className="sr-side-icon"
                  src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${c.name}`}
                />
                <div className="sr-side-info">
                  <div className="sr-side-title">r/{c.name}</div>
                  <div className="sr-side-count">{c.membersCount.toLocaleString()} members</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function SearchPost({ post }) {
  return (
    <div className="sr-post">
      <div className="sr-post-left">
        <div className="sr-post-meta">
          <span className="sr-community">r/{post.communityName}</span>
          • {post.timeAgo || "3y ago"}
        </div>

        <div className="sr-post-title">{post.title}</div>

        <div className="sr-post-sub">
          {post.upvotes} votes • {post.commentsCount} comments
        </div>
      </div>

      {post.thumbnail && (
        <img className="sr-post-thumb" src={post.thumbnail} alt="" />
      )}
    </div>
  );
}

function SearchCommunity({ comm }) {
  return (
    <div className="sr-post">
      <div className="sr-post-left">
        <div className="sr-post-title">r/{comm.name}</div>
        <div className="sr-post-sub">
          {comm.membersCount.toLocaleString()} members
        </div>
      </div>
    </div>
  );
}

function SearchUser({ user }) {
  return (
    <div className="sr-user">
      <img
        className="sr-user-avatar"
        src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user.username}`}
      />

      <div>
        <div className="sr-user-name">{user.displayName}</div>
        <div className="sr-user-handle">@{user.username}</div>
      </div>
    </div>
  );
}
