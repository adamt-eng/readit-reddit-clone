import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormPostImage.css";

const MAX_TITLE_LENGTH = 300;

export default function FormPostImage({ selectedCommunity, userId }) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCommunity || !title.trim() || !image) return;

    const formData = new FormData();
    formData.append("file", image);
    formData.append("title", title);
    formData.append("communityId", selectedCommunity._id);
    formData.append("userId", userId);

    const res = await fetch("http://localhost:5000/upload/image-post", {
      method: "POST",
      body: formData
    });

    const newPost = await res.json();

    // redirect
    navigate(`/posts/${newPost._id}`);
  };

  return (
    <form className="form-image" onSubmit={handleSubmit} autoComplete="off">
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

      <div
        className="dropzone"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
      >
        <span className="dropzone-text">Drag and Drop or upload media</span>
        {image && <div className="image-preview">{image.name}</div>}
        <input
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      <div className="btn-row">
        <button className="btn primary" type="submit" disabled={!title.trim() || !image}>
          Post
        </button>
      </div>
    </form>
  );
}
