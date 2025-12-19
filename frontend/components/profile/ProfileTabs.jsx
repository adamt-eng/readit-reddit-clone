const tabs = ["Posts", "Communities", "Comments","Saved"];

export default function ProfileTabs({ activeTab, setActiveTab }) {
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
