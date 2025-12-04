import React, { useRef, useState } from "react";
import "./FormPostImage.css";

const MAX_TITLE_LENGTH = 300;

export default function FormPostImage() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) setImage(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setImage(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <form className="form-image" autoComplete="off">
      <div className="input-wrap">
        <input
          className="input"
          type="text"
          placeholder="Title"
          value={title}
          maxLength={MAX_TITLE_LENGTH}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <span className="input-required">*</span>
        <span className="title-count">{title.length}/{MAX_TITLE_LENGTH}</span>
      </div>
      <button type="button" className="tags-btn" disabled>
        Add tags
      </button>
      <div
        className="dropzone"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
      >
        <span className="dropzone-text">
          Drag and Drop or upload media{" "}
          <span className="dropzone-icon" role="img" aria-label="upload">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9.5" stroke="#D7DADC"/>
              <path d="M12 8v6m0 0l2.5-2.5M12 14l-2.5-2.5" stroke="#878A8C" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
        </span>
        {image && (
          <div className="image-preview">{image.name}</div>
        )}
        <input
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
      <div className="btn-row">
        <button className="btn" type="button" disabled>
          Save Draft
        </button>
        <button
          className="btn primary"
          type="submit"
          disabled={!title.trim() || !image}
        >
          Post
        </button>
      </div>
    </form>
  );
}