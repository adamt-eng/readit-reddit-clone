
import Post from "../Post/Post";

const dummyPost = {
  id: "abc123",
  community: "TheWeeknd",
  author: "TheSiriHansYouEnjoy",
  timeAgo: "4d ago",
  title: "Name a better 5 song run by Abel I’ll wait",
  text: "Here are my favorites: ...",
  image: "", // Or a valid image link!
  votes: 640,
  commentsCount: 106
};

const dummyComments = [
  {
    id: "c1",
    author: "commenter1",
    body: "Amazing post!",
    timeAgo: "3d ago",
    votes: 50,
    replies: [
      {
        id: "c1r1",
        author: "anotherUser",
        body: "Totally agree.",
        timeAgo: "3d ago",
        votes: 12,
        replies: []
      }
    ]
  }
];

export default function PostPage() {
  // Pass any handlers you want for upvote, comment, etc.
  return (
    <div>
      <Post post={dummyPost} comments={dummyComments} />
    </div>
  );
}
