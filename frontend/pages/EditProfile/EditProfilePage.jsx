import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import "./EditProfilePage.css";
import defaultAvatar from "../../assets/default-avatar.png";

export default function EditProfilePage({ isDark, toggleDarkMode, setCurrentUser  }) {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // LOAD MY PROFILE
  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users/me", {
          withCredentials: true,
        });

        setUsername(res.data.username || "");
        setBio(res.data.bio || "");
        setAvatarUrl(res.data.avatarUrl || "");
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadMe();
  }, []);

  // ✅ OPEN FILE EXPLORER
  const openFilePicker = () => {
    fileRef.current.click();
  };

  // ✅ FILE SELECTED
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // ✅ SAVE PROFILE
  const handleSave = async () => {
  try {
    setSaving(true);
    setError("");

    let finalAvatarUrl = avatarUrl;

    // 1️⃣ UPLOAD AVATAR IF CHANGED
    if (avatarFile) {
      const form = new FormData();
      form.append("avatar", avatarFile); // 🔥 MUST MATCH MULTER

      const uploadRes = await axios.post(
        "http://localhost:5000/upload/avatar",
        form,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      finalAvatarUrl = uploadRes.data.avatarUrl;
    }

    // 2️⃣ UPDATE PROFILE
    const updateRes = await axios.patch(
      "http://localhost:5000/users/me",
      {
        username,
        bio,
        avatarUrl: finalAvatarUrl,
      },
      { withCredentials: true }
    );

    // ✅ update navbar instantly
    setCurrentUser(updateRes.data);

    navigate("/user/me");
  } catch (err) {
    // Log the error message to console for more details
    console.error("Save error:", err);
    setError(err?.response?.data?.message || "Failed to save profile");
  } finally {
    setSaving(false);
  }
};


  const shownAvatar = avatarPreview
    ? avatarPreview
    : avatarUrl
    ? `http://localhost:5000${avatarUrl}`
    : defaultAvatar;

  return (
    <>
      <button
        onClick={toggleDarkMode}
        style={{
          position: "fixed",
          top: "70px",
          right: "20px",
          zIndex: 10000,
          padding: "10px 16px",
          borderRadius: "999px",
          background: isDark ? "#d7dadc" : "#1a1a1b",
          color: isDark ? "#000" : "#fff",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        {isDark ? "Light Mode" : "Dark Mode"}
      </button>

      <div className="profile-page-wrapper">
        <LeftSidebar />

        <div className="profile-page">
          <div className="edit-profile-container">
            <div className="edit-profile-header">
              <h1>Edit Profile</h1>
              <Link to="/user/me">
                <button className="cancel-btn">Cancel</button>
              </Link>
            </div>

            <div className="edit-profile-card">
              <div className="avatar-section">
                <div className="avatar-with-button">
                  <img src={shownAvatar} className="current-avatar" />

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />

                  <button
                    className="change-avatar-btn"
                    type="button"
                    onClick={openFilePicker}
                  >
                    Change Avatar
                  </button>
                </div>
              </div>

              <div className="form-section">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <>
                    {error && <p style={{ color: "crimson" }}>{error}</p>}

                    <label>Display Name</label>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />

                    <label>About (Bio)</label>
                    <textarea
                      rows="5"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />

                    <div className="save-btn-wrapper">
                      <button
                        className="save-btn"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
