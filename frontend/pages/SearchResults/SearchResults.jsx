import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import "./SearchResults.css";

import SearchItem from "../../components/SearchItem/SearchItem";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import dummyData from "../../data/dummydata";

// parse "3y ago", "7mo ago", "22m", "1h", etc -> timestamp (ms)
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
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const query = params.get("q") || "";

  if (query === "") navigate("/");

  const q = query.trim().toLowerCase();
  const now = Date.now();

  const isWithinTime = (timeAgo) => {
    if (timeFilter === "all") return true;
    const ts = parseTimeAgo(timeAgo);
    const diff = now - ts;
    if (timeFilter === "24h") return diff <= 24 * 60 * 60 * 1000;
    if (timeFilter === "7d") return diff <= 7 * 24 * 60 * 60 * 1000;
    if (timeFilter === "30d") return diff <= 30 * 24 * 60 * 60 * 1000;
    return true;
  };

  const filtered = useMemo(() => {
    const posts = dummyData.posts || [];
    const communities = dummyData.communities || [];
    const users = dummyData.users || [];

    if (!q) {
      return {
        posts: [...posts].filter((p) => isWithinTime(p.timeAgo)),
        communities: [...communities],
        users: [...users],
      };
    }

    return {
      posts: posts.filter(
        (p) =>
          ((p.title && p.title.toLowerCase().includes(q)) ||
            (p.communityName && p.communityName.toLowerCase().includes(q))) &&
          isWithinTime(p.timeAgo)
      ),
      communities: communities.filter((c) => c.name && c.name.toLowerCase().includes(q)),
      users: users.filter(
        (u) =>
          (u.username && u.username.toLowerCase().includes(q)) ||
          (u.displayName && u.displayName.toLowerCase().includes(q))
      ),
    };
  }, [isWithinTime, q]);

  const sortedList = useMemo(() => {
    const key = activeTab === "People" ? "users" : activeTab.toLowerCase();
    const list = filtered[key] || [];

    if (key !== "posts") return [...list];

    if (sortBy === "newest") {
      return [...list].sort((a, b) => parseTimeAgo(b.timeAgo) - parseTimeAgo(a.timeAgo));
    }

    if (sortBy === "oldest") {
      return [...list].sort((a, b) => parseTimeAgo(a.timeAgo) - parseTimeAgo(b.timeAgo));
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

      {/* LEFT SIDEBAR */}
      <div className="sr-sidebar">
        <LeftSidebar showStartCommunity={false} />
      </div>

      {/* ORIGINAL PAGE — UNCHANGED */}
      <div className="sr-wrapper">
        <div className="sr-tabs">
          {["Posts", "Communities", "People"].map((tab) => (
            <button
              key={tab}
              className={`sr-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              <span className="sr-tab-count">{filtered[tabKey(tab)]?.length ?? 0}</span>
            </button>
          ))}

          <div className="sr-flex-spacer" />

          <select
            className="sr-sort-box"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort posts"
          >
            <option value="relevance">Relevance</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>

          <select
            className="sr-sort-box"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            aria-label="Filter by time"
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
                  <div className="sr-result-card" key={item.id}>
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
              {dummyData.communities.slice(0, 5).map((c) => (
                <div
                  key={c.id}
                  className="sr-side-item no-router-click"
                  onClick={() => console.log("clicked community:", c.name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      console.log("clicked community:", c.name);
                  }}
                >
                  <img
                    className="sr-side-icon"
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(c.name)}`}
                    alt={`${c.name} avatar`}
                  />
                  <div>
                    <div className="sr-side-title">r/{c.name}</div>
                    <div className="sr-side-count">
                      {Number(c.membersCount).toLocaleString()} members
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
