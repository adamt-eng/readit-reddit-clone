import React, { useState } from "react";
import "./CommentForm.css";

export default function CommentForm({ postId, onComment }) {
  const [text, setText] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onComment?.(postId, text);
    setText("");
  };
  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        className="comment-input"
        placeholder="What are your thoughts?"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button type="submit" className="comment-submit" disabled={!text.trim()}>Comment</button>
    </form>
  );
}
