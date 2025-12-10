import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaBell, FaUser, FaCog, FaSignOutAlt, FaMoon, FaSun, FaComment } from "react-icons/fa";
import "./Navbar.css";

export default function Navbar({ user, onLogout, isLoggedIn, darkMode, onToggleDarkMode, onLoginClick, onSignupClick }) {
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const profileMenuRef = useRef(null);

  const promptLogin = () => alert("Login to continue");

  const toggleProfileMenu = () => {
    setShowProfileMenu(prev => !prev);
  };

  const handleCreatePost = (e) => {
    if (!isLoggedIn) {
        e.preventDefault();
        return promptLogin();
    }
  };

  const handleOpenMessages = () => {
    if (!isLoggedIn) return promptLogin();
  };


const handleSearch = () => {
  const q = searchText.trim();
  if (!q) navigate("/");

  navigate(`/search?q=${encodeURIComponent(q)}`);
};


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownItemClick = (action) => {
    setShowProfileMenu(false);
    setTimeout(() => {
      switch (action) {
        case 'profile':
          // Route handled by <Link>
          break;
        case 'settings':
          console.log("Opening settings");
          break;
        case 'darkMode':
          onToggleDarkMode();
          break;
        case 'logout':
          onLogout();
          break;
        default:
          break;
      }
    }, 100);
  };

  if (isLoggedIn) {
    return (
      <div className="navbar">
        <div className="nav-left">
          <div className="logo-section">
            <Link to="/">
              <img 
                src={"../../assets/reddit-text.png"} 
                alt="reddit logo text"
                className="nav-logo-text"
              />
            </Link>
          </div>
        </div>

        <div className="nav-center">
          <div className="search-container">
            <input 
              placeholder="Search Reddit"
              className="nav-search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <div className="search-icon">
              <FaSearch onClick={handleSearch}/>
            </div>
          </div>
        </div>

        <div className="nav-right logged-in">

          <Link 
            to="/create-post"
            className="nav-icon-btn create-post-btn"
            onClick={handleCreatePost} 
            title="Create Post"
          >
            <FaPlus className={darkMode ? "dark-mode-icon" : ""} />
            <span className="create-text">Create</span>
          </Link>

          <Link 
            to="/messages"
            className="nav-icon-btn"
            onClick={handleOpenMessages}
            title="Direct Messages"
          >
            <FaComment className={`nav-icon ${darkMode ? "dark-mode-icon" : ""}`} />
          </Link>

          <Link to="/notifications" className="nav-icon-btn" title="Notifications">
            <FaBell className={`nav-icon ${darkMode ? "dark-mode-icon" : ""}`} />
            <span className="notification-badge">3</span>
          </Link>

          <div className="profile-menu-container" ref={profileMenuRef}>
            <button className="profile-btn" onClick={toggleProfileMenu}>
              <img 
                src={user?.avatar || "../../assets/profile.png"} 
                alt="Profile"
                className="profile-avatar"
              />
              <span className="profile-name">{user?.username}</span>
              <svg className={`dropdown-icon ${showProfileMenu ? 'open' : ''} ${darkMode ? 'dark-mode' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {showProfileMenu && (
              <div className="profile-dropdown">

                <Link 
                  to={`/user/${user?.username}`} 
                  className="dropdown-item"
                  onClick={() => handleDropdownItemClick('profile')}
                >
                  <FaUser className="dropdown-icon" />
                  <span>Profile</span>
                </Link>

                <div 
                  className="dropdown-item"
                  onClick={() => handleDropdownItemClick('settings')}
                >
                  <FaCog className="dropdown-icon" />
                  <span>Settings</span>
                </div>

                <div 
                  className="dropdown-item"
                  onClick={() => handleDropdownItemClick('darkMode')}
                >
                  {darkMode ? <FaSun className="dropdown-icon" /> : <FaMoon className="dropdown-icon" />}
                  <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </div>

                <div className="dropdown-divider"></div>

                <div 
                  className="dropdown-item logout-btn" 
                  onClick={() => handleDropdownItemClick('logout')}
                >
                  <FaSignOutAlt className="dropdown-icon" />
                  <span>Log Out</span>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="navbar">
      <div className="nav-left">
        <div className="logo-section">
          <Link to="/guest">
            <img 
              src="../../assets/reddit-text.png" 
              alt="reddit logo text"
              className="nav-logo-text"
            />
          </Link>
        </div>
      </div>

      <div className="nav-center">
        <div className="search-container">
          <input 
            placeholder='What is the "default skin" for your country?'
            className="nav-search"
            onClick={promptLogin}
          />
          <div className="search-icon">
            <img 
              src="../../assets/logo.png" 
              alt="reddit logo"
              className="nav-logo"
            />
          </div>
        </div>
      </div>

      <div className="nav-right">
        <button className="login-btn" onClick={onLoginClick}>Log In</button >
        <button className="signup-btn" onClick={onSignupClick}>Sign Up</button >
      </div>
    </div>
  );
}