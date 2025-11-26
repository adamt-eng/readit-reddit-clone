import React, { useState } from "react";
import "./FormPostImage.css";

export default function FormPostImage() {
  const [image, setImage] = useState(null);

  return (
    <div className="form-image">
      <label className="upload-box">
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <span>Select Image</span>
      </label>

      {image && <p>Selected: {image.name}</p>}

      <button className="btn">Post</button>
    </div>
  );
}
