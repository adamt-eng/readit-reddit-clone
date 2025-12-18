import PostCard from "../PostCard/PostCard";
import "./PostList.css";

function PostList({ posts, ...postCardProps }) {
  if (!posts || posts.length === 0)
    return <p className="noPosts">No posts to display.</p>;

  return (
    <div className="postList">
      {posts.map((post) => (
        <PostCard key={post._id || post.id} post={post} {...postCardProps} />
      ))}
    </div>
  );
}

export default PostList;
