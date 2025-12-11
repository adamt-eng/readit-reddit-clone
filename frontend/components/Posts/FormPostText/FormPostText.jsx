import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormPostText.css";

const MAX_TITLE_LENGTH = 300;

export default function FormPostText({ selectedCommunity, userId }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    if (e.target.value.length <= MAX_TITLE_LENGTH) {
      setTitle(e.target.value);
    }
  };

  const canPost =
    selectedCommunity &&
    title.trim().length > 0 &&
    !isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canPost) return;

    try {
      setIsSubmitting(true);

      const res = await fetch("http://localhost:5000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title,
          content: body,
          type: "post",
          communityId: selectedCommunity._id
        })
      });

      if (!res.ok) {
        alert("Failed to create post");
        console.error(await res.text());
        return;
      }

      const newPost = await res.json();

      // ⭐ REDIRECT TO POST PAGE ⭐
      navigate(`/posts/${newPost._id}`);

    } catch (err) {
      console.error("POST ERROR:", err);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
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
        <span className="title-count">
          {title.length}/{MAX_TITLE_LENGTH}
        </span>
      </div>

      <div className="textarea-wrap">
        <textarea
          className="textarea"
          placeholder={
            selectedCommunity
              ? "Body text (optional)"
              : "Select a community first"
          }
          disabled={!selectedCommunity}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div className="btn-row">
        <button className="btn" type="button" disabled>
          Save Draft
        </button>
        <button
          className={`btn primary ${!canPost ? "disabled" : ""}`}
          type="submit"
          disabled={!canPost}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
