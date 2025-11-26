import React, { useState } from "react";
import PostTabs from "../PostTabs/PostTabs";
import FormPostText from "../FormPostText/FormPostText";
import FormPostImage from "../FormPostImage/FormPostImage";
import FormPostLink from "../FormPostLink/FormPostLink";
import "./CreatePost.css";

export default function CreatePost() {
  const [activeTab, setActiveTab] = useState("post");

  return (
    <div className="create-post-container">
      <h2 className="title">Create a Post</h2>

      <PostTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "post" && <FormPostText />}
      {activeTab === "image" && <FormPostImage />}
      {activeTab === "link" && <FormPostLink />}
    </div>
  );
}
