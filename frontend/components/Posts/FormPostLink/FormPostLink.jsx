import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormPostLink.css";

const MAX_TITLE_LENGTH = 300;

export default function FormPostLink({ selectedCommunity, userId }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCommunity || !title.trim() || !url.trim()) return;

    const res = await fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        communityId: selectedCommunity._id,
        title,
        content: url,
        type: "link"
      })
    });

    const newPost = await res.json();

    // redirect
    navigate(`/posts/${newPost._id}`);
  };

  return (
    <form className="form-link" autoComplete="off" onSubmit={handleSubmit}>
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
        <button className="btn primary" type="submit" disabled={!title.trim() || !url.trim()}>
          Post
        </button>
      </div>
    </form>
  );
}
