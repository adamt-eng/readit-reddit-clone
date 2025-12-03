// src/components/CreateCommunityModal.jsx
import React, { useState, useMemo } from "react";
import "./CreateCommunityModal.css";


const ALL_TOPICS = [
  "Consumer Electronics",
  "Computers & Hardware",
  "Software & Apps",
  "DIY Electronics",
  "Artificial Intelligence & Machine Learning",
  "Virtual & Augmented Reality",
  "3D Printing",
  "Programming",
  "Tech News & Discussion",
  "Streaming Services",
  "Boating & Sailing",
  "Aviation",
  "Trains & Public Transportation",
  "Motorcycles",
  "Cars & Trucks",
];

const CreateCommunityModal = ({ onClose }) => {
  const [step, setStep] = useState(0);

  // --- form state ---
  const [name, setName] = useState("r/AskDaveTaylor");
  const [description, setDescription] = useState(
    "Reddit community for fans and people interested in both the Web site AskDaveTaylor.com and the YouTube channel AskDaveTaylor. Tech Q&A with a sense of humor. Let's go!"
  );
  const [bannerPreview, setBannerPreview] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [topicFilter, setTopicFilter] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [communityType, setCommunityType] = useState("public");
  const [isMature, setIsMature] = useState(false);

  // --- step navigation ---
  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  // --- handlers ---
  const handleSelectTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else if (selectedTopics.length < 3) {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const filteredTopics = useMemo(() => {
    const search = topicFilter.toLowerCase();
    return ALL_TOPICS.filter((t) => t.toLowerCase().includes(search));
  }, [topicFilter]);

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

  const handleCreate = (e) => {
    e.preventDefault();
    console.log({
      name,
      description,
      bannerPreview,
      iconPreview,
      selectedTopics,
      communityType,
      isMature,
    });
    alert("Community data logged to console (shape only).");
    onClose();
  };

  // --- small helpers ---

  const renderStepDots = () => (
    <div className="cc-step-dots">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={`cc-dot ${step === i ? "active" : ""}`} />
      ))}
    </div>
  );

  const renderPreviewCard = () => (
    <div className="cc-preview-card">
      <div className="cc-preview-banner" />
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

  // --- RENDER FUNCTIONS (instead of components) ---

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

  const renderStep3 = () => (
    <div className="cc-step-body">
      <h2 className="cc-title">Pick your topics</h2>
      <p className="cc-subtitle">
        Add up to 3 topics to help interested redditors find your community.
      </p>

      <div className="cc-topic-search">
        <input
          className="cc-input"
          placeholder="Filter topics"
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
        />
      </div>

      <div className="cc-selected-topics">
        Topics {selectedTopics.length}/3
      </div>

      <div className="cc-topic-chips">
        {filteredTopics.map((topic) => {
          const selected = selectedTopics.includes(topic);
          return (
            <button
              key={topic}
              type="button"
              className={`cc-chip ${selected ? "selected" : ""}`}
              onClick={() => handleSelectTopic(topic)}
            >
              {topic}
              {selected && <span className="cc-chip-x">×</span>}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="cc-step-body">
      <h2 className="cc-title">What kind of community is this?</h2>
      <p className="cc-subtitle">
        Decide who can view and contribute in your community.
      </p>

      <div className="cc-type-list">
        <label
          className={`cc-type-card ${
            communityType === "public" ? "selected" : ""
          }`}
        >
          <input
            type="radio"
            name="communityType"
            value="public"
            checked={communityType === "public"}
            onChange={() => setCommunityType("public")}
          />
          <div className="cc-type-main">
            <div className="cc-type-title">Public</div>
            <div className="cc-type-desc">
              Anyone can view, post, and comment in this community.
            </div>
          </div>
        </label>

        <label
          className={`cc-type-card ${
            communityType === "restricted" ? "selected" : ""
          }`}
        >
          <input
            type="radio"
            name="communityType"
            value="restricted"
            checked={communityType === "restricted"}
            onChange={() => setCommunityType("restricted")}
          />
          <div className="cc-type-main">
            <div className="cc-type-title">Restricted</div>
            <div className="cc-type-desc">
              Anyone can view, but only approved users can contribute.
            </div>
          </div>
        </label>

        <label
          className={`cc-type-card ${
            communityType === "private" ? "selected" : ""
          }`}
        >
          <input
            type="radio"
            name="communityType"
            value="private"
            checked={communityType === "private"}
            onChange={() => setCommunityType("private")}
          />
          <div className="cc-type-main">
            <div className="cc-type-title">Private</div>
            <div className="cc-type-desc">
              Only approved users can view and contribute.
            </div>
          </div>
        </label>
      </div>

      <div className="cc-mature-row">
        <div>
          <div className="cc-type-title">Mature (18+)</div>
          <div className="cc-type-desc">
            Users must be over 18 to view and contribute.
          </div>
        </div>
        <label className="cc-switch">
          <input
            type="checkbox"
            checked={isMature}
            onChange={(e) => setIsMature(e.target.checked)}
          />
          <span className="cc-slider" />
        </label>
      </div>

      <p className="cc-footnote">
        By continuing, you agree to our Mod Code of Conduct and acknowledge
        that you understand the Reddit Content Policy.
      </p>
    </div>
  );

  // --- main render ---
  return (
    <div className="cc-overlay">
      <div className="cc-modal">
        <div className="cc-header">
          <button className="cc-x" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* step content */}
        {step === 0 && renderStep1()}
        {step === 1 && renderStep2()}
        {step === 2 && renderStep3()}
        {step === 3 && renderStep4()}

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
            {step < 3 ? (
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
