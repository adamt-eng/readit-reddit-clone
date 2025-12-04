import React, { useState } from "react";
import "./FormPostLink.css";

const MAX_TITLE_LENGTH = 300;

export default function FormPostLink() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  return (
    <form className="form-link" autoComplete="off">
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

      <div className="input-wrap link-wrap">
        <input
          className="input"
          type="url"
          placeholder="Link URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <span className="input-required link-required">*</span>
      </div>
      <div className="btn-row">
        <button className="btn" type="button" disabled>
          Save Draft
        </button>
        <button
          className="btn primary"
          type="submit"
          disabled={!title.trim() || !url.trim()}
        >
          Post
        </button>
      </div>
    </form>
  );
}