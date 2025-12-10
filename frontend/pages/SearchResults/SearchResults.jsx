import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

import "./SearchResults.css";

import SearchItem from "../../components/SearchItem/SearchItem";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";

const API_URL = "http://localhost:5000";
console.log("API_URL =", API_URL);


// parse "3y ago", "7mo ago", etc.
function parseTimeAgo(s) {
  if (!s) return 0;
  const str = s.toLowerCase().replace("ago", "").trim();
  const num = parseInt(str, 10);
  if (Number.isNaN(num)) return 0;

  if (str.includes("m") && !str.includes("mo")) return Date.now() - num * 60 * 1000;
  if (str.includes("h")) return Date.now() - num * 60 * 60 * 1000;
  if (str.includes("d")) return Date.now() - num * 24 * 60 * 60 * 1000;
  if (str.includes("mo")) return Date.now() - num * 30 * 24 * 60 * 60 * 1000;
  if (str.includes("y")) return Date.now() - num * 365 * 24 * 60 * 60 * 1000;

  return 0;
}

export default function SearchResults() {
  const [activeTab, setActiveTab] = useState("Posts");
  const [sortBy, setSortBy] = useState("relevance");
  const [timeFilter, setTimeFilter] = useState("all");

  const [searchResults, setSearchResults] = useState({
    posts: [],
    users: [],
    communities: []
  });

  const [params] = useSearchParams();
  const navigate = useNavigate();

  const query = params.get("q") || "";
  console.log(query)

  if (query === "") navigate("/");

  const q = query.trim().toLowerCase();
  const now = Date.now();


  useEffect(() => {
    if (!q) return;

    async function runSearch() {
      try {
        const [postsRes, usersRes, communitiesRes] = await Promise.all([
          axios.get(`http://localhost:5000/search/posts`, { params: { q } }),
          axios.get(`http://localhost:5000/search/users`, { params: { q } }),
          axios.get(`http://localhost:5000/search/communities`, { params: { q } }),
        ]);

        setSearchResults({
          posts: Array.isArray(postsRes.data) ? postsRes.data : [],
          users: Array.isArray(usersRes.data) ? usersRes.data : [],
          communities: Array.isArray(communitiesRes.data) ? communitiesRes.data : [],

        });

      } catch (err) {
        console.error("Search error:", err);
      }
    }

    runSearch();
  }, [q]);

  const isWithinTime = (createdAt) => {
    if (timeFilter === "all") return true;

    const ts = new Date(createdAt).getTime();
    const diff = now - ts;

    if (timeFilter === "24h") return diff <= 24 * 60 * 60 * 1000;
    if (timeFilter === "7d") return diff <= 7 * 24 * 60 * 60 * 1000;
    if (timeFilter === "30d") return diff <= 30 * 24 * 60 * 60 * 1000;

    return true;
  };

  const filtered = useMemo(() => {
    return {
      posts: searchResults.posts.filter((p) => isWithinTime(p.createdAt)),
      communities: searchResults.communities,
      users: searchResults.users
    };
  }, [searchResults, timeFilter]);

  const sortedList = useMemo(() => {
    const key = activeTab === "People" ? "users" : activeTab.toLowerCase();
    const list = filtered[key] || [];

    if (key !== "posts") return [...list];

    if (sortBy === "newest") {
      return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sortBy === "oldest") {
      return [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return [...list];
  }, [filtered, activeTab, sortBy]);

  const tabKey = (tab) => (tab === "People" ? "users" : tab.toLowerCase());

  const typeMap = {
    Posts: "post",
    Communities: "community",
    People: "user"
  };

  return (
    <div className="sr-layout">

      <div className="sr-sidebar">
        <LeftSidebar showStartCommunity={false} />
      </div>

      <div className="sr-wrapper">
        <div className="sr-tabs">
          {["Posts", "Communities", "People"].map((tab) => (
            <button
              key={tab}
              className={`sr-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              <span className="sr-tab-count">
                {filtered[tabKey(tab)]?.length ?? 0}
              </span>
            </button>
          ))}

          <div className="sr-flex-spacer" />

          <select
            className="sr-sort-box"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="relevance">Relevance</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>

          <select
            className="sr-sort-box"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="all">All time</option>
            <option value="24h">Past 24h</option>
            <option value="7d">Past week</option>
            <option value="30d">Past month</option>
          </select>
        </div>

        <div className="sr-content-container">
          <div className="sr-left-column">
            <div className="sr-results-scroll">
              {sortedList.length ? (
                sortedList.map((item) => (
                  <div className="sr-result-card" key={item._id || item.id}>
                    <SearchItem type={typeMap[activeTab]} data={item} />
                  </div>
                ))
              ) : (
                <div className="sr-empty">No results found.</div>
              )}
            </div>
          </div>

          <div className="sr-right-column">
            <div className="sr-card">
              <h3>Communities</h3>

              {(searchResults.communities || []).slice(0, 5).map((c) => (
                <div
                  key={c._id}
                  className="sr-side-item no-router-click"
                  onClick={() => console.log("clicked community:", c.name)}
                >
                  <img
                    className="sr-side-icon"
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(c.name)}`}
                    alt={`${c.name} avatar`}
                  />
                  <div>
                    <div className="sr-side-title">{c.name}</div>
                    <div className="sr-side-count">
                      {Number(c.memberCount || 0).toLocaleString()} members
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="sr-card">
              <h3>Search tips</h3>
              <ul className="sr-help-list">
                <li>Try shorter or broader terms</li>
                <li>Search by r/communityName or u/username</li>
                <li>Use filters to narrow by time</li>
              </ul>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
