console.log("Post component loaded!");

import "./Post.css";
import PostHeader from "./PostHeader/PostHeader";
import PostContent from "./PostContent/PostContent";
import PostActions from "./PostActions/PostActions";
import CommentForm from "./CommentForm/CommentForm";
import Comment from "../Comment/Comment"; 

export default function Post({ post, comments = [], ...handlers }) {
  return (
    <div className="post-card">
      <PostHeader post={post} />
      <PostContent post={post} />
      <PostActions post={post} {...handlers} />
      <CommentForm postId={post.id} {...handlers} />
      <div className="comments-list">
        {comments.map(comment => (
          <Comment
            key={comment.id}
            comment={comment}
            postId={post.id}
            {...handlers}
          />
        ))}
      </div>
    </div>
  );
}
