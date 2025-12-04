import "./PostHeader.css";

export default function PostHeader({ post }) {
  return (
    <div className="post-header">
      <span className="post-community">r/{post.community}</span>
      <span className="dot">•</span>
      <span className="post-author">Posted by u/{post.author}</span>
      <span className="dot">•</span>
      <span className="post-time">{post.timeAgo}</span>
    </div>
  );
}
