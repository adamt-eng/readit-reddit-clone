import { useState } from "react";
import "./CreateCommunityModal.css";

const CreateCommunityModal = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const baseUrl = import.meta.env.VITE_API_URL;

  const [name, setName] = useState("r/AskDaveTaylor");
  const [description, setDescription] = useState(
    "Reddit community for fans and people interested in both the Web site AskDaveTaylor.com and the YouTube channel AskDaveTaylor. Tech Q&A with a sense of humor. Let's go!",
  );

  // store files (for real upload)
  const [bannerFile, setBannerFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);

  // store previews (UI only)
  const [bannerPreview, setBannerPreview] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  const nextStep = () => setStep((s) => Math.min(s + 1, 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file)); // preview only
  };

  const handleIconChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIconFile(file);
    setIconPreview(URL.createObjectURL(file)); // preview only
  };

  const uploadFile = async (endpoint, fieldName, file) => {
    const form = new FormData();
    form.append(fieldName, file);

    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      credentials: "include",
      body: form,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Upload failed");
    }

    return data;
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const cleanName = name.replace(/^r\//, "").trim();

      let finalBannerUrl = "";
      let finalIconUrl = "";

      // 1) upload banner if chosen
      if (bannerFile) {
        const up = await uploadFile(
          "/upload/community/banner",
          "banner",
          bannerFile,
        );
        finalBannerUrl = up.bannerUrl; // "/uploads/community/banners/xxx.png"
      }

      // 2) upload icon if chosen
      if (iconFile) {
        const up = await uploadFile("/upload/community/icon", "icon", iconFile);
        finalIconUrl = up.iconUrl; // "/uploads/community/icons/xxx.png"
      }

      // 3) create community with REAL URLs
      const response = await fetch(`${baseUrl}/communities`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          title: `r/${cleanName}`,
          description,
          bannerUrl: finalBannerUrl,
          iconUrl: finalIconUrl,
          nsfw: false,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.message || "Error");
        return;
      }

      alert("Community created!");
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.message || "Network error");
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
            ? {
                backgroundImage: `url(${bannerPreview})`,
                backgroundSize: "cover",
              }
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
          <div className="cc-preview-name">{name || "r/your_community"}</div>
          <div className="cc-preview-meta">1 member · 1 online</div>
        </div>
      </div>
      <p className="cc-preview-description">
        {description || "Describe your community here."}
      </p>
    </div>
  );

  // Step 1: name + description
  const renderStep1 = () => (
    <div className="cc-step-body cc-step-columns">
      <div className="cc-left">
        <h2 className="cc-title">Tell us about your community</h2>
        <p className="cc-subtitle">
          A name and description help people understand what your community is
          all about.
        </p>

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

  // Step 2: style (banner + icon)
  const renderStep2 = () => (
    <div className="cc-step-body cc-step-columns">
      <div className="cc-left">
        <h2 className="cc-title">Style your community</h2>
        <p className="cc-subtitle">
          Adding visual flair will catch new members’ attention. You can update
          this at any time.
        </p>

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

        {bannerPreview && (
          <p className="cc-hint">
            (Preview only – will be uploaded on Create.)
          </p>
        )}
      </div>

      <div className="cc-right">{renderPreviewCard()}</div>
    </div>
  );

  return (
    <div className="cc-overlay">
      <div className="cc-modal">
        <div className="cc-header">
          <button className="cc-x" onClick={onClose}>
            ✕
          </button>
        </div>

        {step === 0 && renderStep1()}
        {step === 1 && renderStep2()}

        <div className="cc-footer">
          <div>{renderStepDots()}</div>
          <div className="cc-footer-buttons">
            <button className="cc-btn secondary" onClick={onClose}>
              Cancel
            </button>
            {step > 0 && (
              <button className="cc-btn secondary" onClick={prevStep}>
                Back
              </button>
            )}
            {step < 1 ? (
              <button className="cc-btn primary" onClick={nextStep}>
                Next
              </button>
            ) : (
              <button className="cc-btn primary" onClick={handleCreate}>
                Create Community
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityModal;
