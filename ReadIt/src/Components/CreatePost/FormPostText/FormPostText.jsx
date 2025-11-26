import React, { useState } from "react";
import "./FormPostText.css";

export default function FormPostText() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="form-text">
      <input
        className="input"
        placeholder="Title"
        maxLength={300}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="textarea"
        placeholder="Text (optional)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <button className="btn">Post</button>
    </div>
  );
}
