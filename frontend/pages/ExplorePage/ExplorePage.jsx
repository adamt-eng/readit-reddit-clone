import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";
import SearchItem from "../../components/SearchItem/SearchItem";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import TopCommunities from "../../components/TopCommunities/TopCommunities";
import "./ExplorePage.css";

const API_URL = `${import.meta.env.VITE_API_URL}`;

export default function Explore() {
  const [query,setQuery] = useState("")
  const [communities, setCommunities] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 50;


  useEffect(() => {
    async function fetchCommunities() {
      try {
        setIsLoading(true);

        const res = await axios.get(`${API_URL}/communities`, {
          withCredentials: true,
          params: { page, limit,query },
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
  }, [page,query]);

  return (
    <div className="sr-layout">
      <div className="sr-sidebar">
        <LeftSidebar />
      </div>

      <div className="sr-wrapper">
        <div className="sr-tabs">
          <h2>Explore Communities</h2>
          <div className="sr-flex-spacer" />
          <span>{total.toLocaleString()} communities</span>
        </div>

        <div className="sr-content-container">
          {/* ===== LEFT / MAIN COLUMN ===== */}
          <div className="sr-left-column">
            <div className="sr-local-search">
              <input
                type="text"
                placeholder="Search communities by name or description"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="sr-results-scroll test">
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
                      isNotSearch={true}
                      isMyProfile={true}
                    />
                  </div>
                ))
              ) : (
                <div className="sr-empty">No communities found.</div>
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
                  onClick={() => page * limit < total && setPage(page + 1)}
                />
              </div>
            )}
          </div>

          {/* ===== RIGHT COLUMN (UNCHANGED) ===== */}
          <div className="sr-right-column">
            <TopCommunities />

            <div className="sr-card ttt">
              <h3>Explore Reddit</h3>
              <p>We have a whole world for you to explore, get ready.</p>
              <p>
                Remember, always surround yourself with those who share the same
                interests and idiologies!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
