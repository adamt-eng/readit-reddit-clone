import React, { useState } from "react";
import "./FormPostText.css";

const MAX_TITLE_LENGTH = 300;

export default function FormPostText() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleTitleChange = (e) => {
    if (e.target.value.length <= MAX_TITLE_LENGTH) {
      setTitle(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    // submit logic here
    setTitle("");
    setBody("");
  };

  return (
    <form className="form-text" onSubmit={handleSubmit} autoComplete="off">
      <div className="input-wrap">
        <input
          className="input"
          type="text"
          placeholder="Title"
          value={title}
          maxLength={MAX_TITLE_LENGTH}
          onChange={handleTitleChange}
          required
        />
        <span className="input-required">*</span>
        <span className="title-count">{title.length}/{MAX_TITLE_LENGTH}</span>
      </div>

      <div className="textarea-wrap">
        <div className="textarea-toolbar">
          <button type="button" className="toolbar-btn" title="Bold"><b>B</b></button>
          <button type="button" className="toolbar-btn" title="Italic"><i>I</i></button>
          {/* Add more formatting buttons as needed for UI only */}
        </div>
        <textarea
          className="textarea"
          placeholder="Body text (optional)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div className="btn-row">
        <button className="btn" type="button" disabled>
          Save Draft
        </button>
        <button className="btn primary" type="submit" disabled={!title.trim()}>
          Post
        </button>
      </div>
    </form>
  );
}
