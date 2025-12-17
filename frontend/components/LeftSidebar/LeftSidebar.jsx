/* eslint-disable no-unused-vars */

import {
  HiHome,
  HiFire,
  HiSearch,
  HiClock,
  HiUserGroup,
  HiInformationCircle,
  HiSpeakerphone,
  HiCode,
  HiQuestionMarkCircle,
  HiNewspaper,
  HiBriefcase,
  HiBookOpen,
  HiPlus
} from "react-icons/hi";
import { NavLink } from "react-router-dom";
import "./LeftSidebar.css";

export default function LeftSidebar({
  showStartCommunity = false,
  onStartCommunity,
}) {
  const promptLogin = () => alert("Login to continue");

  const handleStartCommunityClick = () => {
    if (onStartCommunity) {
      onStartCommunity();
    }
  };

  return (
    <div className="left-sidebar">
      <nav className="sidebar-nav">

        {/* ================= HOME / POPULAR ================= */}
        <div className="nav-section">

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <HiHome className="nav-icon" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/popular"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <HiFire className="nav-icon" />
            <span>Popular</span>
          </NavLink>
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <HiUserGroup className="nav-icon" />
            <span>Explore Communities</span>

          </NavLink>
        </div>
        

        {/* ================= CREATE ================= */}
        {showStartCommunity && (
          <div className="nav-section">
            <h4>CREATE</h4>
            <button
              className="start-community-btn"
              onClick={handleStartCommunityClick}
            >
              <HiPlus className="nav-icon" />
              <span>Start a community</span>
            </button>
          </div>
        )}


          

        {/* ================= RESOURCES ================= */}
        <div className="nav-section">
          <h4>RESOURCES</h4>

          <div className="nav-item">
            <HiInformationCircle className="nav-icon" />
            <span>About Reddit</span>
          </div>

          <div className="nav-item">
            <HiSpeakerphone className="nav-icon" />

            <span>Advertise</span>
          </div>

          <div className="nav-item">
            <HiCode className="nav-icon" />
            <span>Developer Platform</span>
          </div>

          <div className="nav-item">
            <span>Reddit Pro BETA</span>
          </div>

          <div className="nav-item">
            <HiQuestionMarkCircle className="nav-icon" />
            <span>Help</span>
          </div>

          <div className="nav-item">
            <HiNewspaper className="nav-icon" />
            <span>Blog</span>
          </div>

          <div className="nav-item">
            <HiBriefcase className="nav-icon" />
            <span>Careers</span>
          </div>

          <div className="nav-item">
            <HiBookOpen className="nav-icon" />
            <span>Press</span>
          </div>

        </div>
      </nav>
    </div>
  );
}
