import React, { useState } from "react";
import "./FormPostLink.css";

export default function FormPostLink() {
  const [url, setUrl] = useState("");

  return (
    <div className="form-link">
      <input
        className="input"
        placeholder="Paste your link"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button className="btn">Post</button>
    </div>
  );
}
