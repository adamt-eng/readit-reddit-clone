import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

import "./SearchResults.css";

import SearchItem from "../../components/SearchItem/SearchItem";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";

const API_URL = "http://localhost:5000";

export default function SearchResults() {
  const [activeTab, setActiveTab] = useState("Posts");
  const [sortBy, setSortBy] = useState("relevance"); // relevance | newest | oldest
  const [timeFilter, setTimeFilter] = useState("all"); // all | 24h | 7d | 30d

  const [searchResults, setSearchResults] = useState({
    posts: [],
    users: [],
    communities: []
  });

  const [topCommunities, setTopCommunities] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // ---------- PAGINATION ----------
  const [page, setPage] = useState(1);
  const limit = 20;
  const [total, setTotal] = useState(0);

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get("q") || "";

  if (query === "") navigate("/");

  const q = query.trim().toLowerCase();


  // ---------- FETCH TOP COMMUNITIES (STATIC) ----------
  useEffect(() => {
    async function fetchTopComms() {
      try {
        const res = await axios.get(`${API_URL}/search/top-communities`);
        setTopCommunities(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Top communities load error:", err);
      }
    }

    fetchTopComms();
  }, []);


  // ---------- FETCH SEARCH RESULTS ----------
  useEffect(() => {
    if (!q) return;

    async function runSearch() {
      try {
        setIsLoading(true);

        const [postsRes, usersRes, communitiesRes] = await Promise.all([
          axios.get(`${API_URL}/search/posts`, {
            params: { q, page, limit, sort: sortBy, time: timeFilter }
          }),
          axios.get(`${API_URL}/search/users`, {
            params: { q, page, limit }
          }),
          axios.get(`${API_URL}/search/communities`, {
            params: { q, page, limit }
          })
        ]);

        setSearchResults({
          posts: postsRes.data.results || [],
          users: usersRes.data.results || [],
          communities: communitiesRes.data.results || []
        });

        // Only posts return meaningful total (like Reddit)
        setTotal(postsRes.data.total || 0);

      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    runSearch();
  }, [q, page, sortBy, timeFilter]);


  // ---------- SELECT LIST ----------
  const tabKey = (tab) => (tab === "People" ? "users" : tab.toLowerCase());
  const typeMap = { Posts: "post", Communities: "community", People: "user" };
  const list = searchResults[tabKey(activeTab)];


  return (
    <div className="sr-layout">

      <div className="sr-sidebar">
        <LeftSidebar showStartCommunity={false} />
      </div>

      <div className="sr-wrapper">
        {/* ---------- TABS + FILTER CONTROLS ---------- */}
        <div className="sr-tabs">
          {["Posts", "Communities", "People"].map((tab) => (
            <button
              key={tab}
              className={`sr-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab);
                setPage(1);
              }}
            >
              {tab}
              <span className="sr-tab-count">{list?.length ?? 0}</span>
            </button>
          ))}

          <div className="sr-flex-spacer" />

          {/* SORT POSTS ONLY */}
          <select
            disabled={activeTab !== "Posts"}
            className="sr-sort-box"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
          >
            <option value="relevance">Relevance</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>

          {/* TIME FILTER ONLY FOR POSTS */}
          <select
            disabled={activeTab !== "Posts"}
            className="sr-sort-box"
            value={timeFilter}
            onChange={(e) => {
              setTimeFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All time</option>
            <option value="24h">Past 24h</option>
            <option value="7d">Past week</option>
            <option value="30d">Past month</option>
          </select>
        </div>

        {/* ---------- RESULTS + SIDEBAR ---------- */}
        <div className="sr-content-container">
          <div className="sr-left-column">
            <div className="sr-results-scroll">

              {/* LOADING */}
              {isLoading ? (
                <div className="sr-loading">
                  <div className="sr-spinner"></div>
                  <span>Searching...</span>
                </div>
              ) : list?.length ? (
                list.map((item) => (
                  <div className="sr-result-card" key={item._id || item.id}>
                    <SearchItem type={typeMap[activeTab]} data={item} />
                  </div>
                ))
              ) : (
                <div className="sr-empty">No results found.</div>
              )}

              {/* ---------- PAGINATION (POSTS ONLY) ---------- */}
              {activeTab === "Posts" && !isLoading && (
                <div className="sr-pagination">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>

                  <span>Page {page}</span>

                  <button
                    disabled={page * limit >= total}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* ---------- RIGHT SIDEBAR ---------- */}
          <div className="sr-right-column">
            <div className="sr-card">
              <h3>Top Communities</h3>

              {topCommunities.map((c) => (
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
                    <div className="sr-side-title">r/{c.name}</div>
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
                <li>Use filters to narrow results by time</li>
              </ul>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
