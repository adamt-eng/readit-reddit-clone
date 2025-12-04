import React, { useState } from "react";
import "./DM.css";

export default function DirectMessages({ darkMode }) {
  const [selected, setSelected] = useState(null);

  const chats = [
    { id: 1, name: "u/alice", last: "hey!", avatar: "/profile.png" },
    { id: 2, name: "u/mark", last: "you there?", avatar: "/profile.png" },
  ];

  const messages = {
    "u/alice": [
      { from: "alice", text: "Hey! What's up?" },
      { from: "me", text: "Not much, you?" },
    ],
    "u/mark": [
      { from: "mark", text: "Ready for tonight?" },
      { from: "me", text: "Yep!" },
    ],
  };

  return (
    <div className={`chat-layout ${darkMode ? "dark-mode" : ""}`}>
      {/* LEFT SIDEBAR */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">Chats</div>

        <input className="chat-search" placeholder="Search chats" />

        <div className="chat-list">
          {chats.map((c) => (
            <div
              key={c.id}
              className={`chat-list-item ${
                selected === c.name ? "active" : ""
              }`}
              onClick={() => setSelected(c.name)}
            >
              <img src={c.avatar} className="chat-avatar" />
              <div className="chat-list-text">
                <div className="chat-list-name">{c.name}</div>
                <div className="chat-list-last">{c.last}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT CHAT WINDOW */}
      <div className="chat-window">
        {!selected ? (
          <div className="chat-empty">Select a chat to start messaging</div>
        ) : (
          <>
            <div className="chat-window-header">{selected}</div>

            <div className="chat-messages">
              {messages[selected].map((m, i) => (
                <div
                  key={i}
                  className={`chat-message ${
                    m.from === "me" ? "sent" : "received"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="chat-input-bar">
              <input className="chat-input" placeholder="Message" />
              <button className="chat-send-btn">Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
