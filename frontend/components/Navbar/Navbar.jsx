import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaBell,
  FaBellSlash, 
  FaUser,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaComment,
} from "react-icons/fa";
import axios from "axios";
import { useSocket } from "../../context/SocketContext";
import { useLocation } from "react-router-dom";
import "./Navbar.css";
import profileFallback from "../../assets/profile.png";
import Readit from "../../assets/Readit.png";
import logo from "../../assets/logo.png";
import { useTheme } from "../../context/ThemeProvider.jsx";

export default function Navbar({
  setUser,
  user,
  onLoginClick,
  onSignupClick,
  onOpenFloatingDM,
}) {
  const socket = useSocket();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [notisCount, setNotisCount] = useState(0);
  const [avatarBust, setAvatarBust] = useState(Date.now());

  //notis
  const [socketPopup, setSocketPopup] = useState(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isNotiMuted, setIsNotiMuted] = useState(false);
  const [showNotiDropdown, setShowNotiDropdown] = useState(false);
  const [latestNotis, setLatestNotis] = useState([]);
  const showNotiDropdownRef = useRef(showNotiDropdown);



  const popupTimeoutRef = useRef(null);

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (user?.avatarUrl) setAvatarBust(Date.now());
  }, [user?.avatarUrl]);

  const location = useLocation();

  const profileMenuRef = useRef(null);

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

  const handleCreatePost = () => {
    if (!user) {
      return;
    }
  };


  const handleSearch = () => {
    const q = searchText.trim();
    if (!q) navigate("/");

    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/authentication/logout`,
        {},
        { withCredentials: true },
      );
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setNotisCount(0);
      navigate("/");
    }
  };

    const fetchLatestNotis = useCallback(async () => {
    if (!user) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/notifications`,
        { withCredentials: true }
      );
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/notifications/read-all`,
        {},
        { withCredentials: true },
      );
      setLatestNotis(res.data);
    } catch (err) {
      console.error("Error fetching latest notifications", err);
    }
  }, [user]);


  const handleOpenNotifications = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/notifications/read-all`,
        {},
        { withCredentials: true },
      );
      setNotisCount(0);
      navigate('/notifications');
      setShowNotiDropdown(false);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCount = useCallback(async () => {
    if (!user) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/notifications/count/${user._id}`,
        { withCredentials: true },
      );
      console.log("Initial unread:", res.data.unreadCount);
      setNotisCount(res.data.unreadCount);
    } catch (err) {
      console.log("Error fetching count:", err);
    }
  }, [user]);


  useEffect(()=>{
      setShowNotiDropdown(false);
  },[location.pathname]);

  useEffect(() => {
  showNotiDropdownRef.current = showNotiDropdown;
}, [showNotiDropdown]);



  // Fetch initial count
  useEffect(() => {
    if (!user?._id) return;
    fetchCount();
  }, [location,user?._id, fetchCount]);

  // Real-time socket updates
  useEffect(() => {
    if (!user?._id || !socket) return;

    socket.emit("register", user._id);

    const handleNotification = async (notification) => {
      await fetchCount();
      await setLatestNotis((prev)=>[notification,...prev])

      if (
        isNotiMuted ||
        location.pathname === "/notifications" ||
        showNotiDropdownRef.current
      ) {
        return;
      }

      if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
    }

      // show popup
      setSocketPopup(notification);
      setIsFadingOut(false);

      popupTimeoutRef.current = setTimeout(() => {
        setIsFadingOut(true);

        setTimeout(() => {
          setSocketPopup(null);
          setIsFadingOut(false);
        }, 400);
      }, 2600);

    };


    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [location, user?._id, fetchCount, socket,isNotiMuted]);

  const handleDropdownItemClick = (action) => {
    setShowProfileMenu(false);
    setTimeout(() => {
      switch (action) {
        // case "profile": Route handled by <Link> break;
        case "darkMode":
          toggleTheme();
          break;
        case "logout":
          handleLogout();
          break;
        default:
          break;
      }
    }, 100);
  };

  if (user) {
    return (
      <div className="navbar">
        <div className="nav-left">
          <div className="logo-section">
            <Link to="/">
              <img
                src={Readit}
                alt="Belal's Readit Logo"
                className="nav-logo-text"
              />
            </Link>
          </div>
        </div>

        <div className="nav-center">
          <div className="search-container">
            <input
              placeholder="Search Readit"
              className="nav-search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <div className="search-icon">
              <FaSearch onClick={handleSearch} />
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
            <FaPlus />
            <span className="create-text">Create</span>
          </Link>

          <button
            className="nav-icon-btn"
            onClick={onOpenFloatingDM}
            title="Direct Messages"
          >
            <FaComment />
          </button>


          {/*notis*/}
          <div className="nav-icon-btn noti-wrapper">
            <div
              className="noti-icon-container"
              onClick={async () => {
                await fetchLatestNotis();
                await fetchCount();
                setShowNotiDropdown((prev) => !prev);

              }}
            >
              {!isNotiMuted ? <FaBell /> : <FaBellSlash />}

              <button
                className={`noti-mute-btn ${isNotiMuted ? "muted" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotiMuted((prev) => !prev);
                }}
              >
                {isNotiMuted ? "Muted" : "Mute"}
              </button>
            </div>

            {!isNotiMuted && notisCount > 0 && !showNotiDropdown&& location.pathname!=="/notifications"&& (
              <span className="notification-badge">{notisCount}</span>
            )}

            {showNotiDropdown && location.pathname !=="/notifications"&&(
              <div className="noti-dropdown">
                <div className="noti-dropdown-header">
                  <span>Notifications</span>
                  <button
                    className="noti-show-more"
                    onClick={handleOpenNotifications}
                  >
                    Show more
                  </button>
                </div>

                <div className="noti-dropdown-list">
                  {latestNotis.length === 0 ? (
                    <div className="noti-empty">No notifications yet</div>
                  ) : (
                    latestNotis.map((n) => (
                      <Link to={'/notifications'} key={n._id} className="noti-dropdown-item">
                        <div className="noti-item-message">
                          {n.payload?.message || "New notification"}
                        </div>
                        <div className="noti-item-time">
                          {n.timeAgoFormatted || ""}
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* socket popup stays unchanged */}
            {socketPopup && !showNotiDropdown &&location.pathname !== "/notifications"&&(
              <Link to={'/notifications'} className={`noti-toast ${isFadingOut ? "fade-out" : ""}`}>
                <div className="noti-toast-accent" />
                <div className="noti-toast-body">
                  <div className="noti-toast-title">New notification</div>
                  <div className="noti-toast-message">
                    {socketPopup.payload?.message}
                  </div>
                </div>
              </Link>
            )}
          </div>



          <div className="profile-menu-container" ref={profileMenuRef}>
            <button className="profile-btn" onClick={toggleProfileMenu}>
              <img
                src={
                  user?.avatarUrl
                    ? `${import.meta.env.VITE_API_URL}${user.avatarUrl}?v=${avatarBust}`
                    : profileFallback
                }
                alt="Profile"
                className="profile-avatar"
                onError={(e) => {
                  e.currentTarget.src = profileFallback;
                }}
              />

              <span className="profile-name">{user?.username}</span>
              <svg
                className={`dropdown-icon ${showProfileMenu ? "open" : ""}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <Link to="/user/me" className="dropdown-item">
                  <FaUser className="dropdown-icon" />
                  <span>Profile</span>
                </Link>

                <div
                  className="dropdown-item"
                  onClick={() => handleDropdownItemClick("darkMode")}
                >
                  {theme === "dark" ? <FaSun /> : <FaMoon />}
                  <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </div>

                <div className="dropdown-divider"></div>

                <div
                  className="dropdown-item logout-btn"
                  onClick={() => handleDropdownItemClick("logout")}
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
              src={Readit}
              alt="Belal's Readit Logo"
              className="nav-logo-text"
            />
          </Link>
        </div>
      </div>

      <div className="nav-center">
        <div className="search-container">
          <input
            placeholder="Please log in to to dive into the world of Readit!"
            className="nav-search"
          />
          <div className="search-icon">
            <img src={logo} alt="reddit logo" className="nav-logo" />
          </div>
        </div>
      </div>

      <div className="nav-right">
        <button className="login-btn" onClick={onLoginClick}>
          Log In
        </button>
        <button className="signup-btn" onClick={onSignupClick}>
          Sign Up
        </button>
      </div>
    </div>
  );
}
