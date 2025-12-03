import React from "react";
import PostCard from "../../PostCard/PostCard";
import "./PostList.css";

function PostList({ posts }) {
    if (!posts || posts.length === 0) {
        return <p className="noPosts">No posts to display.</p>;
    }

    return (
        <div className="postList">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}

export default PostList;
