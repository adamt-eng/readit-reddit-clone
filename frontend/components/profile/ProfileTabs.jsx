const tabs = ["Posts", "Communities", "Comments","Saved"];

export default function ProfileTabs({isMyProfile, activeTab, setActiveTab }) {
  const tabs = isMyProfile?["Posts", "Communities", "Comments","Saved"]:["Posts", "Communities", "Comments"];
  return (
    <div className="profile-tabs card">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`profile-tab ${activeTab === tab ? "active" : ""}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
