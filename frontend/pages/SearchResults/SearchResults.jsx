import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import axios from "axios";

import "./SearchResults.css";

import SearchItem from "../../components/SearchItem/SearchItem";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";

const API_URL = "http://localhost:5000";

export default function SearchResults() {
  const [activeTab, setActiveTab] = useState("Posts");
  const [sortBy, setSortBy] = useState("relevance");
  const [timeFilter, setTimeFilter] = useState("all");

  const [searchResults, setSearchResults] = useState({
    posts: [],
    users: [],
    communities: []
  });

  // store total for each type
  const [totalCount, setTotalCount] = useState({
    posts: 0,
    users: 0,
    communities: 0
  });

  const [topCommunities, setTopCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // pagination
  const [page, setPage] = useState(1);
  const limit = 20;

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get("q") || "";

  if (query === "") navigate("/");

  const q = query.trim().toLowerCase();

  // determine key
  const tabKey = (tab) => (tab === "People" ? "users" : tab.toLowerCase());
  const typeMap = { Posts: "post", Communities: "community", People: "user" };
  const list = searchResults[tabKey(activeTab)];


  // ---------- FETCH TOP COMMUNITIES ----------
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

        // update results
        setSearchResults({
          posts: postsRes.data.results || [],
          users: usersRes.data.results || [],
          communities: communitiesRes.data.results || []
        });

        // update total counts
        setTotalCount({
          posts: postsRes.data.total || 0,
          users: usersRes.data.total || 0,
          communities: communitiesRes.data.total || 0
        });

      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    runSearch();
  }, [q, page, sortBy, timeFilter]);


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
              <span className="sr-tab-count">
                {totalCount[tabKey(tab)]}
              </span>
            </button>
          ))}

          <div className="sr-flex-spacer" />

          {/* SORT (posts only) */}
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

          {/* TIME FILTER (posts only) */}
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

          {/* SCROLL AREA */}
          <div className="sr-results-scroll">
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
          </div>

          {/* FIXED PAGINATION BAR */}
          {!isLoading && (
            <div className="sr-pagination-fixed">
              <FiChevronLeft
                className={`sr-page-arrow ${page === 1 ? "disabled" : ""}`}
                onClick={() => page > 1 && setPage(page - 1)}
              />

              <span className="sr-page-number">{page}</span>

              <FiChevronRight
                className={`sr-page-arrow ${
                  page * limit >= totalCount[tabKey(activeTab)] ? "disabled" : ""
                }`}
                onClick={() =>
                  page * limit < totalCount[tabKey(activeTab)] && setPage(page + 1)
                }
              />
            </div>
          )}

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
                    <div className="sr-side-title">
                      {c.name.startsWith("r/") ? c.name : "r/" + c.name}
                    </div>
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
