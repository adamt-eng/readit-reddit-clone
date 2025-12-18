import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import "./EditProfilePage.css";
import defaultAvatar from "../../assets/default-avatar.png";

export default function EditProfilePage({ setCurrentUser = () => {} }) {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const API = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // CHANGE PASSWORD MODAL
  const [showPassModal, setShowPassModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passSaving, setPassSaving] = useState(false);
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  const openPasswordModal = () => {
    setPassError("");
    setPassSuccess("");
    setOldPassword("");
    setNewPassword("");
    setShowPassModal(true);
  };

  const closePasswordModal = () => {
    if (passSaving) return;
    setShowPassModal(false);
  };

  // LOAD MY PROFILE
  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await axios.get(`${API}/users/me`, {
          withCredentials: true,
        });

        setUsername(res.data.username || "");
        setBio(res.data.bio || "");
        setAvatarUrl(res.data.avatarUrl || "");
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadMe();
  }, [API]);

  // OPEN FILE EXPLORER
  const openFilePicker = () => fileRef.current?.click();

  // FILE SELECTED
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // SAVE PROFILE
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      let finalAvatarUrl = avatarUrl;

      // 1) upload if changed
      if (avatarFile) {
        const form = new FormData();
        form.append("avatar", avatarFile);

        const uploadRes = await axios.post(`${API}/upload/avatar`, form, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });

        finalAvatarUrl = uploadRes.data.avatarUrl;
      }

      // 2) update profile in DB
      await axios.patch(
        `${API}/users/me`,
        { username, bio, avatarUrl: finalAvatarUrl },
        { withCredentials: true },
      );

      // 3) update App currentUser instantly + bust cache for navbar image
      const cacheBustedAvatar = finalAvatarUrl
        ? `${finalAvatarUrl}?v=${Date.now()}`
        : finalAvatarUrl;

      setCurrentUser((prev) => ({
        ...(prev || {}),
        username,
        bio,
        avatarUrl: cacheBustedAvatar,
      }));

      navigate("/user/me");
    } catch (err) {
      console.error("Save error:", err);
      setError(err?.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  // CHANGE PASSWORD
  const handleChangePassword = async () => {
    try {
      setPassSaving(true);
      setPassError("");
      setPassSuccess("");

      if (!oldPassword || !newPassword) {
        setPassError("Please fill both fields.");
        return;
      }
      if (newPassword.length < 5) {
        setPassError("New password must be at least 5 characters.");
        return;
      }

      await axios.patch(
        `${API}/users/me/password`,
        { oldPassword, newPassword },
        { withCredentials: true },
      );

      setPassSuccess("Password updated successfully ✅");
      setTimeout(() => {
        setShowPassModal(false);
      }, 700);
    } catch (err) {
      console.error("Password change error:", err);
      setPassError(err?.response?.data?.message || "Failed to change password");
    } finally {
      setPassSaving(false);
    }
  };

  const shownAvatar = avatarPreview
    ? avatarPreview
    : avatarUrl
      ? `${API}${avatarUrl}`
      : defaultAvatar;

  return (
    <>
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
                  <img
                    src={shownAvatar}
                    alt="avatar"
                    className="current-avatar"
                  />

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

                    <div className="password-btn-wrapper">
                      <button
                        className="password-btn"
                        type="button"
                        onClick={openPasswordModal}
                      >
                        Change Password
                      </button>
                    </div>

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

            {/* PASSWORD MODAL */}
            {showPassModal && (
              <div className="modal-overlay" onClick={closePasswordModal}>
                <div
                  className="modal-card"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-header">
                    <h2>Change Password</h2>
                    <button
                      className="modal-x"
                      onClick={closePasswordModal}
                      type="button"
                    >
                      ✕
                    </button>
                  </div>

                  {passError && <p className="modal-error">{passError}</p>}
                  {passSuccess && (
                    <p className="modal-success">{passSuccess}</p>
                  )}

                  <label>Old Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter old password"
                  />

                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />

                  <div className="modal-actions">
                    <button
                      className="cancel-btn"
                      type="button"
                      onClick={closePasswordModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="save-btn"
                      type="button"
                      onClick={handleChangePassword}
                      disabled={passSaving}
                    >
                      {passSaving ? "Saving..." : "Update Password"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}