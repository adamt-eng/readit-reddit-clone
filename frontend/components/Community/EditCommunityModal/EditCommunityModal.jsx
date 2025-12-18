import { useState } from "react";
import "../CreateCommunityModal/CreateCommunityModal.css"; 

const API_URL = import.meta.env.VITE_API_URL;

const EditCommunityModal = ({ community, onClose, onSaved }) => {
  const [step, setStep] = useState(0);

  // form state
  const [name, setName] = useState(`r/${community?.name || ""}`);
  const [description, setDescription] = useState(community?.description || "");

  const [bannerFile, setBannerFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);

  const [bannerPreview, setBannerPreview] = useState(
    community?.bannerUrl ? `${API_URL}${community.bannerUrl}` : ""
  );
  const [iconPreview, setIconPreview] = useState(
    community?.iconUrl ? `${API_URL}${community.iconUrl}` : ""
  );

  const nextStep = () => setStep((s) => Math.min(s + 1, 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file)); // blob preview only
  };

  const handleIconChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file)); // blob preview only
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const cleanNewName = name.replace(/^r\//, "").trim();

      let finalBannerUrl = community?.bannerUrl || "";
      let finalIconUrl = community?.iconUrl || "";

      if (bannerFile) {
        const form = new FormData();
        form.append("banner", bannerFile); 

        const uploadRes = await fetch(`${API_URL}/upload/community/banner`, {
          method: "POST",
          credentials: "include",
          body: form,
        });

        const uploadData = await uploadRes.json().catch(() => ({}));

        if (!uploadRes.ok) {
          alert(uploadData.message || "Banner upload failed");
          return;
        }

        finalBannerUrl = uploadData.bannerUrl; 
      }

      if (iconFile) {
        const form = new FormData();
        form.append("icon", iconFile); 

        const uploadRes = await fetch(`${API_URL}/upload/community/icon`, {
          method: "POST",
          credentials: "include",
          body: form,
        });

        const uploadData = await uploadRes.json().catch(() => ({}));

        if (!uploadRes.ok) {
          alert(uploadData.message || "Icon upload failed");
          return;
        }

        finalIconUrl = uploadData.iconUrl; 
      }

      const res = await fetch(`${API_URL}/communities/${community.name}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newName: cleanNewName,
          title: `r/${cleanNewName}`,
          description,
          bannerUrl: finalBannerUrl,
          iconUrl: finalIconUrl,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      alert("Community updated!");

      const updatedCommunity = data.community || data;
      onSaved?.(updatedCommunity);
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  const renderStepDots = () => (
    <div className="cc-step-dots">
      {[0, 1].map((i) => (
        <span key={i} className={`cc-dot ${step === i ? "active" : ""}`} />
      ))}
    </div>
  );

  const renderPreviewCard = () => (
    <div className="cc-preview-card">
      <div
        className="cc-preview-banner"
        style={
          bannerPreview
            ? { backgroundImage: `url(${bannerPreview})`, backgroundSize: "cover" }
            : {}
        }
      />
      <div className="cc-preview-header">
        <div className="cc-preview-icon-wrapper">
          {iconPreview ? (
            <img src={iconPreview} alt="icon" className="cc-preview-icon-img" />
          ) : (
            <div className="cc-preview-icon-placeholder">r/</div>
          )}
        </div>
        <div>
          <div className="cc-preview-name">{name || "r/community"}</div>
          <div className="cc-preview-meta">{community?.memberCount || 0} members</div>
        </div>
      </div>
      <p className="cc-preview-description">
        {description || "Describe your community here."}
      </p>
    </div>
  );

  const renderStep1 = () => (
    <div className="cc-step-body cc-step-columns">
      <div className="cc-left">
        <h2 className="cc-title">Edit community details</h2>
        <p className="cc-subtitle">You can update name and description.</p>

        <label className="cc-field-label">
          Community name <span className="cc-required">*</span>
        </label>
        <div className="cc-input-wrapper">
          <input
            className="cc-input large"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={21}
          />
          <span className="cc-char-count">{name.length}</span>
        </div>

        <label className="cc-field-label">
          Description <span className="cc-required">*</span>
        </label>
        <div className="cc-input-wrapper">
          <textarea
            className="cc-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
          />
          <span className="cc-char-count">{description.length}</span>
        </div>
      </div>

      <div className="cc-right">{renderPreviewCard()}</div>
    </div>
  );

  const renderStep2 = () => (
    <div className="cc-step-body cc-step-columns">
      <div className="cc-left">
        <h2 className="cc-title">Edit community style</h2>
        <p className="cc-subtitle">Update banner and icon.</p>

        <div className="cc-style-row">
          <span>Banner</span>
          <label className="cc-add-btn">
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              style={{ display: "none" }}
            />
            Add
          </label>
        </div>

        <div className="cc-style-row">
          <span>Icon</span>
          <label className="cc-add-btn">
            <input
              type="file"
              accept="image/*"
              onChange={handleIconChange}
              style={{ display: "none" }}
            />
            Add
          </label>
        </div>
      </div>

      <div className="cc-right">{renderPreviewCard()}</div>
    </div>
  );

  return (
    <div className="cc-overlay">
      <div className="cc-modal">
        <div className="cc-header">
          <button className="cc-x" onClick={onClose}>✕</button>
        </div>

        {step === 0 && renderStep1()}
        {step === 1 && renderStep2()}

        <div className="cc-footer">
          <div>{renderStepDots()}</div>
          <div className="cc-footer-buttons">
            <button className="cc-btn secondary" onClick={onClose}>Cancel</button>
            {step > 0 && (
              <button className="cc-btn secondary" onClick={prevStep}>Back</button>
            )}
            {step < 1 ? (
              <button className="cc-btn primary" onClick={nextStep}>Next</button>
            ) : (
              <button className="cc-btn primary" onClick={handleSave}>Save Changes</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCommunityModal;
