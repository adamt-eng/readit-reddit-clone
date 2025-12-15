import { useEffect, useState, useRef } from "react";
import "./DM.css";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function DirectMessages({ darkMode, currentUser }) {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    if (currentUser && currentUser._id) {
      socket.emit("register", currentUser._id);
    }

    socket.on("dm:new_message", (payload) => {
      const { conversationId, message } = payload;
      if (selected && conversationId === selected._id) {
        setMessages((m) => [...m, message]);
      }

      // refresh conversations list so UI shows latest
      fetchConversations();
    });

    return () => {
      if (currentUser && currentUser._id) socket.emit("unregister", currentUser._id);
      socket.off("dm:new_message");
    };
     
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, selected]);

  // fetch conversations once currentUser is available (prevents 401 when landing on /messages)
  useEffect(() => {
    if (currentUser && currentUser._id) fetchConversations();
    // if no currentUser, wait until App sets it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  async function fetchConversations() {
    try {
      const url = `http://localhost:5000/dm/conversations${currentUser && currentUser._id ? `?asUserId=${encodeURIComponent(currentUser._id)}` : ""}`;
      const res = await axios.get(url, { withCredentials: true });
      setConversations(res.data || []);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  }

  // debounce search
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }

    const id = setTimeout(async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/search?q=${encodeURIComponent(q)}&limit=30`, {
          withCredentials: true,
        });
        const users = res.data && res.data.results ? res.data.results : [];
        setSearchResults(users.filter(((user)=>user.username!=currentUser.username)));
      } catch (err) {
        console.error("User search failed:", err);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(id);
  }, [searchQuery]);

  async function createConversationWithUser(user) {
    if (!user || !user._id) return;
    try {
      const url = `http://localhost:5000/dm/conversations/${user._id}?asUserId=${encodeURIComponent(currentUser?._id || "")}`;
      const res = await axios.post(url, {}, { withCredentials: true });
      const convo = res.data;
      setSearchQuery("");
      setSearchResults([]);
      await fetchConversations();
      openConversation(convo);
    } catch (err) {
      console.error("Create conversation failed:", err);
      alert("Failed to create conversation");
    }
  }

  async function openConversation(convo) {
    setSelected(convo);
    try {
      const url = `http://localhost:5000/dm/messages/${convo._id}?limit=200${currentUser && currentUser._id ? `&asUserId=${encodeURIComponent(currentUser._id)}` : ""}`;
      const res = await axios.get(url, { withCredentials: true });
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setMessages([]);
    }
  }

  async function handleSend() {
    if (!input.trim()) return;
    try {
      const body = { conversationId: selected?._id, content: input, asUserId: currentUser?._id };
      const res = await axios.post("http://localhost:5000/dm/messages", body, { withCredentials: true });
      setMessages((m) => [...m, res.data]);
      setInput("");
      fetchConversations();
    } catch (err) {
      console.error("Send failed:", err);
    }
  }

  function otherParticipant(convo) {
    if (!currentUser) return null;
    const a = convo.userA;
    const b = convo.userB;
    const other = a._id === currentUser._id ? b : a;
    return other;
  }

  return (
    <div className={`chat-layout ${darkMode ? "dark-mode" : ""}`}>
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <div>Chats</div>
          <div className="chat-new-form">
            <input
              className="chat-new-input"
              placeholder="Search username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              className="chat-new-btn"
              onClick={() => {
                if (searchResults.length) createConversationWithUser(searchResults[0]);
              }}
            >
              New
            </button>
            {searchResults.length > 0 && (
              <div className="chat-search-dropdown">
                {searchResults.map((u) => (
                  <div
                    key={u._id}
                    className="chat-search-item"
                    onClick={() => createConversationWithUser(u)}
                  >
                    <img src={u.avatarUrl || "/profile.png"} className="chat-avatar" alt="av" />
                    <div style={{ marginLeft: 8 }}>
                      <div style={{ fontWeight: 700 }}>{u.username}</div>
                      <div style={{ fontSize: 12, color: "var(--dm-subtext)" }}>{u.karma ? `${u.karma} karma` : ""}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <input className="chat-search" placeholder="Search chats" />

        <div className="chat-list">
          {conversations.map((c) => {
            const other = otherParticipant(c);
            return (
              <div
                key={c._id}
                className={`chat-list-item ${selected?._id === c._id ? "active" : ""}`}
                onClick={() => openConversation(c)}
              >
                <img src={other?.avatarUrl || "/profile.png"} className="chat-avatar" alt="av" />
                <div className="chat-list-text">
                  <div className="chat-list-name">{other?.username || "Unknown"}</div>
                  <div className="chat-list-last">{/* could show last message */}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="chat-window">
        {!selected ? (
          <div className="chat-empty">Select a chat to start messaging</div>
        ) : (
          <>
            <div className="chat-window-header">{otherParticipant(selected)?.username}</div>

            <div className="chat-messages" ref={scrollRef}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`chat-message ${m.senderId?._id === currentUser?._id ? "sent" : "received"}`}
                >
                  {m.content || m.text}
                </div>
              ))}
            </div>

            <div className="chat-input-bar">
              <input
                className="chat-input"
                placeholder="Message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />
              <button className="chat-send-btn" onClick={handleSend}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
