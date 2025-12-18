import "./PostTabs.css";

export default function PostTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "post", label: "Text" },
    { key: "image", label: "Images" },
  ];
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          type="button"
          className={`tab ${activeTab === tab.key ? "active" : ""}`}
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
