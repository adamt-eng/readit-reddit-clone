import { Link } from "react-router-dom";
import './styles/CreatePostButton.css';

export default function CreatePostButton() {
  return (
    <div className="create-post-wrapper">
      <Link to="/create-post">
        <button className="create-post-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4z" />
          </svg>
          Create Post
        </button>
      </Link>
    </div>
  );
}
