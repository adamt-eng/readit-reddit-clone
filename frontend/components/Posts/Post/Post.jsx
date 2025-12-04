import "./Post.css";
import PostHeader from "./PostHeader/PostHeader";
import PostContent from "./PostContent/PostContent";
import PostActions from "./PostActions/PostActions";
import CommentForm from "./CommentForm/CommentForm";
import Comment from "../../Comment/Comment"; 

export default function Post({ post, comments = [], onUpvote, onDownvote, onComment, onVote, onReply }) {
  return (
    <div className="post-card">
      <PostHeader post={post} />
      <PostContent post={post} />
      <PostActions post={post} onUpvote={onUpvote} onDownvote={onDownvote} />
      <CommentForm postId={post.id} onComment={onComment} />
      <div className="comments-list">
        {comments.map(comment => (
          <Comment
            key={comment.id}
            comment={comment}
            postId={post.id}
            onVote={onVote}     
            onReply={onReply}    
          />
        ))}
      </div>
    </div>
  );
}