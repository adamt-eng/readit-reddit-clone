import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePostForm.css";

const MAX_TITLE_LENGTH = 300;

export default function CreatePostForm({ type = "post", selectedCommunity }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const canSubmit =
    selectedCommunity &&
    title.trim().length > 0 &&
    !isSubmitting &&
    (type === "post" || (type === "image" && image));

  /* IMAGE HANDLERS */
  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  /* SUBMIT */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setIsSubmitting(true);
      let res;

      // TEXT POST
      if (type === "post") {
        res = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content: body,
            type: "post",
            communityId: selectedCommunity._id,
          }),
        });
      }

      // IMAGE POST (with body text)
      if (type === "image") {
        res = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content: body,
            type: "image",
            communityId: selectedCommunity._id,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.message || "Failed to create post");
          return;
        }

        const newPost = await res.json();

        const formData = new FormData();
        formData.append("postImage", image);
        formData.append("postId", newPost._id);

        const imgRes = await fetch(
          `${import.meta.env.VITE_API_URL}/upload/post-image`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          },
        );

        if (!imgRes.ok) {
          alert("Image upload failed");
          return;
        }

        navigate(`/posts/${newPost._id}`);
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Failed to create post");
        return;
      }

      const newPost = await res.json();
      navigate(`/posts/${newPost._id}`);
    } catch (err) {
      console.error("CREATE POST ERROR:", err);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* RENDER */

  return (
    <form
      className="create-post-form"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      {/* TITLE */}
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
        <span className="title-count">
          {title.length}/{MAX_TITLE_LENGTH}
        </span>
      </div>

      {/* BODY TEXT (POST + IMAGE) */}
      {(type === "post" || type === "image") && (
        <div className="textarea-wrap">
          <textarea
            className="textarea"
            placeholder={
              selectedCommunity ? "Body text" : "Select a community first"
            }
            disabled={!selectedCommunity}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
      )}

      {/* IMAGE POST */}
      {type === "image" && (
        <div
          className="dropzone"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
        >
          <span className="dropzone-text">Drag and Drop or upload media</span>

          {image && <div className="image-preview">{image.name}</div>}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* ACTIONS */}
      <div className="btn-row">
        <button
          className={`btn primary ${!canSubmit ? "disabled" : ""}`}
          type="submit"
          disabled={!canSubmit}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
