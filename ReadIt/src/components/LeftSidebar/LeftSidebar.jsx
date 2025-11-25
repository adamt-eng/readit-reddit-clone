/*/components/LeftSidebar/*/
import React from "react";
import { 
  HiHome, HiFire, HiSearch, HiClock, HiUserGroup,
  HiInformationCircle, HiSpeakerphone, HiCode,
  HiQuestionMarkCircle, HiNewspaper, HiBriefcase, HiBookOpen
} from "react-icons/hi";
import "./LeftSidebar.css";

export default function LeftSidebar({ darkMode }) {
  const promptLogin = () => alert("Login to continue");

  return (
    <div className="left-sidebar">
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-item active">
            <HiHome className="nav-icon" />
            <span>Home</span>
          </div>
          <div className="nav-item">
            <HiFire className="nav-icon" />
            <span>Popular</span>
          </div>
          <div className="nav-item">
            <HiSearch className="nav-icon" />
            <span>Explore</span>
          </div>
        </div>

        <div className="nav-section">
          <h4>RECENT</h4>
          <div className="nav-item">
            <HiUserGroup className="nav-icon" />
            <span>r/Voltages</span>
          </div>
        </div>

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