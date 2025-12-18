import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function TopCommunities() {
  const [topCommunities, setTopCommunities] = useState([]);
  useEffect(() => {
    async function fetchTopComms() {
      try {
        const res = await axios.get(`${API_URL}/search/top-communities`, {
          withCredentials: true,
        });
        setTopCommunities(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Top communities load error:", err);
      }
    }

    fetchTopComms();
  }, []);

  return (
    <div className="sr-right-column">
      <div className="sr-card">
        <h3>Top Communities</h3>

        {topCommunities.map((c) => (
          <Link to = {`/community/${c.name}`}
            key={c._id}
            className="sr-side-item no-router-click"
            onClick={() => console.log("clicked community:", c.name)}
          >
            <img
              className="sr-side-icon"
              src={
                c?.iconUrl
                  ? `${import.meta.env.VITE_API_URL}${c.iconUrl}`
                  : `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(
                      c.name,
                    )}`
              }
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
          </Link>
        ))}
      </div>
    </div>
  );
}
