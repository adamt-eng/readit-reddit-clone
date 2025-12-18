import { useState } from "react";
import "./CommunitySidebar.css";
import EditCommunityModal from "../EditCommunityModal/EditCommunityModal";

function CommunitySidebar({
  community,
  isMember,
  setIsMember,
  isModerator,
  onCommunityUpdated,
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!community) return null;

  const handleLeave = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/communities/${community.name}/leave`,
        { method: "DELETE", credentials: "include" },
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.message || "Leave failed");
        return;
      }

      alert("Left community successfully");
      setIsMember(false);
    } catch (err) {
      console.error("Leave error:", err);
      alert("Network or server error");
    }
  };

  return (
    <div className="communitySidebar">
      <div className="aboutSection">
        <h2>r/{community.name}</h2>
        <p className="description">{community.description}</p>

        <div className="stats">
          <div className="stat">
            <strong>{community.memberCount}</strong>
            <span>Members</span>
          </div>
        </div>

        {isMember && (
          <button className="leaveBtn" onClick={handleLeave}>
            Leave
          </button>
        )}

        {isModerator && (
          <button
            className="editCommunityBtn"
            onClick={() => setIsEditOpen(true)}
          >
            Edit Community
          </button>
        )}
      </div>

      {isEditOpen && (
        <EditCommunityModal
          key={community?._id || community?.name}
          community={community}
          onClose={() => setIsEditOpen(false)}
          onSaved={(updatedCommunity) => {
            //update community in parent immediately
            onCommunityUpdated?.(updatedCommunity);
            //close modal
            setIsEditOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default CommunitySidebar;
