import { useState } from "react";
import "./CreateCommunityModal.css";

const CreateCommunityModal = ({ onClose, darkMode }) => {
  const [step, setStep] = useState(0);

  // --- form state ---
  const [name, setName] = useState("r/AskDaveTaylor");
  const [description, setDescription] = useState(
    "Reddit community for fans and people interested in both the Web site AskDaveTaylor.com and the YouTube channel AskDaveTaylor. Tech Q&A with a sense of humor. Let's go!"
  );
  const [bannerPreview, setBannerPreview] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  // --- step navigation (ONLY 0 and 1 now) ---
  const nextStep = () => setStep((s) => Math.min(s + 1, 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  // --- handlers ---
  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBannerPreview(url);
    }
  };

  const handleIconChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setIconPreview(url);
    }
  };

const handleCreate = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/communities", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.replace(/^r\//, ""),
        title: name,
        description,
        bannerUrl: bannerPreview || "",
        iconUrl: iconPreview || "",
        nsfw: false, // add later if needed
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Error");
      return;
    }

    console.log("Created:", data);
    alert("Community created!");
    onClose();
  } catch (error) {
    console.error(error);
    alert("Network error");
  }
};


  // --- small helpers ---

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
            <img
              src={iconPreview}
              alt="icon"
              className="cc-preview-icon-img"
            />
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

  // --- STEP 1: name + description ---
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

  // --- STEP 2: style (banner + icon) ---
  const renderStep2 = () => (
    <div className="cc-step-body cc-step-columns">
      <div className="cc-left">
        <h2 className="cc-title">Style your community</h2>
        <p className="cc-subtitle">
          Adding visual flair will catch new members’ attention and help
          establish your community’s culture. You can update this at any time.
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
            (Preview only – no real cropping, just the image.)
          </p>
        )}
      </div>

      <div className="cc-right">{renderPreviewCard()}</div>
    </div>
  );

  // --- main render ---
  return (
    <div className={`cc-overlay ${darkMode ? "dark" : ""}`}>
      <div className={`cc-modal ${darkMode ? "dark" : ""}`}>
        <div className="cc-header">
          <button className="cc-x" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* step content */}
        {step === 0 && renderStep1()}
        {step === 1 && renderStep2()}

        {/* footer */}
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
