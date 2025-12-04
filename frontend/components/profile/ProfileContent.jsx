import EmptyState from './EmptyState';
import CreatePostButton from './CreatePostButton';   // ← NEW

export default function ProfileContent({ activeTab = 'Overview' }) {
  const hasPosts = false; // Change to true later when you have real posts

  return (
    <div className="card profile-content">
      {/* CREATE POST BUTTON — ALWAYS VISIBLE ON PROFILE */}
      <CreatePostButton />

      {/* Show content based on active tab */}
      {activeTab === 'Overview' && (
        <>
          {hasPosts ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#777' }}>
              Posts will appear here
            </div>
          ) : (
            <EmptyState />
          )}
        </>
      )}

      {/* Other tabs (Posts, Comments, etc.) */}
      {activeTab === 'Posts' && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#777' }}>
          This user has no posts yet.
        </div>
      )}

      {activeTab === 'Comments' && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#777' }}>
          This user has no comments yet.
        </div>
      )}

      {['Saved', 'Hidden', 'Upvoted', 'Downvoted'].includes(activeTab) && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#777' }}>
          Nothing here yet.
        </div>
      )}
    </div>
  );
}