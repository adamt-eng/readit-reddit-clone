/* eslint-disable no-unused-vars */
// components/LeftSidebar/LeftSidebar.jsx
import React, { useState } from "react";
import { 
  HiHome, HiFire, HiSearch, HiClock, HiUserGroup,
  HiInformationCircle, HiSpeakerphone, HiCode,
  HiQuestionMarkCircle, HiNewspaper, HiBriefcase, HiBookOpen,
  HiPlus 
} from "react-icons/hi";
import "./LeftSidebar.css";

import CreateCommunityModal from "../Community/CreateCommunityModal/CreateCommunityModal";

export default function LeftSidebar({ darkMode, showStartCommunity = false }) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const promptLogin = () => alert("Login to continue");

  const openCreateModal = () => {
    // if you later add real auth, you can check login here first
    // e.g. if (!isLoggedIn) return promptLogin();
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  return (
    <>
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

          {/* Start Community Button - Only shown when prop is true */}
          {showStartCommunity && (
            <div className="nav-section">
              <h4>CREATE</h4>
              <button 
                className="start-community-btn"
                onClick={openCreateModal}   // <-- open the modal
              >
                <HiPlus className="nav-icon" />
                <span>Start a community</span>
              </button>
            </div>
          )}

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

      {/* Modal lives here, over the whole page */}
      {showCreateModal && (
        <CreateCommunityModal onClose={closeCreateModal} />
      )}
    </>
  );
}