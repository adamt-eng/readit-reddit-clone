import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

import axios from "axios";

import "../SearchResults/SearchResults.css";

import SearchItem from "../../components/SearchItem/SearchItem";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";

const API_URL = "http://localhost:5000";

export default function Explore() {
  const [communities, setCommunities] = useState([]);
  const [total, setTotal] = useState(0);
  const [topCommunities, setTopCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // pagination
  const [page, setPage] = useState(1);
  const limit = 20;

//fetch all comms  
useEffect(() => {
    async function fetchCommunities() {
      try {
        setIsLoading(true);

        const res = await axios.get(`${API_URL}/communities`, {
          withCredentials: true,
          params: { page, limit }
        });

        setCommunities(res.data.results || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        console.error("Explore communities load error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCommunities();
  }, [page]);

  //fetch top comms
  useEffect(() => {
    async function fetchTopComms() {
      try {
        const res = await axios.get(
          `${API_URL}/search/top-communities`,
          { withCredentials: true }
        );
        setTopCommunities(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Top communities load error:", err);
      }
    }

    fetchTopComms();
  }, []);

  return (
    <div className="sr-layout">
      <div className="sr-sidebar">
        <LeftSidebar showStartCommunity={false} />
      </div>

      <div className="sr-wrapper">
        <div className="sr-tabs">
          <h2 style={{ margin: 0 }}>Explore Communities</h2>
          <div className="sr-flex-spacer" />
          <span style={{ color: "#7c7c7c" }}>
            {total.toLocaleString()} communities
          </span>
        </div>

        <div className="sr-content-container">
          <div className="sr-left-column">
            <div className="sr-results-scroll">
              {isLoading ? (
                <div className="sr-loading">
                  <div className="sr-spinner"></div>
                  <span>Loading communities...</span>
                </div>
              ) : communities.length ? (
                communities.map((comm) => (
                  <div className="sr-result-card" key={comm._id}>
                    <SearchItem
                      type="community"
                      data={comm}
                      member={comm.isMember}
                      isNotSearch = {true}
                      isMyProfile = {true}
                    />
                  </div>
                ))
              ) : (
                <div className="sr-empty">
                  No communities found.
                </div>
              )}
            </div>

            {!isLoading && (
              <div className="sr-pagination-fixed">
                <FiChevronLeft
                  className={`sr-page-arrow ${page === 1 ? "disabled" : ""}`}
                  onClick={() => page > 1 && setPage(page - 1)}
                />

                <span className="sr-page-number">{page}</span>

                <FiChevronRight
                  className={`sr-page-arrow ${
                    page * limit >= total ? "disabled" : ""
                  }`}
                  onClick={() =>
                    page * limit < total && setPage(page + 1)
                  }
                />
              </div>
            )}
          </div>

          <div className="sr-right-column">
            <div className="sr-card">
              <h3>Top Communities</h3>

              {topCommunities.map((c) => (
                <Link to = {`/community/${c.name}`} >
                <div
                  key={c._id}
                  className="sr-side-item no-router-click"
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
                </Link>
              ))}
            </div>

            <div className="sr-card" style = {{padding:"20px 10px"}}>
              <h3>Explore Reddit</h3>
              <p style={{ color: "#7c7c7c", fontSize: "16px", lineHeight: "1.5",margin:"10px 0px" }}>
                We have a whole world for you to explore, get ready.
              </p>

              <p style={{ color: "#7c7c7c", fontSize: "16px", lineHeight: "1.5" }}>
                Remember, always surround yourself with those who share the same interests and idiologies!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
