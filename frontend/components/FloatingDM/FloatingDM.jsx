/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../../context/SocketContext";
import profileFallback from "../../assets/profile.png";
import { FaTimes, FaExternalLinkAlt, FaPaperPlane } from "react-icons/fa";
import "./FloatingDM.css";

export default function FloatingDM({ isOpen, onClose, user }) {
  const socket = useSocket();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const scrollRef = useRef();

  const resolveAvatar = (url) => {
    if (!url) return profileFallback;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${import.meta.env.VITE_API_URL}${url}`;
  };

  const formatTime = (createdAt) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const formatDetailedTime = (createdAt) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  async function fetchConversations() {
    try {
      const url = `${import.meta.env.VITE_API_URL}/dm/conversations`;
      const res = await axios.get(url, { withCredentials: true });
      setConversations(res.data || []);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  }

  useEffect(() => {
    if (!isOpen || !user || !socket) return;

    if (user && user._id) {
      socket.emit("register", user._id);
    }

    socket.on("dm:new_message", (payload) => {
      const { conversationId, message } = payload;
      if (selected && conversationId === selected._id) {
        setMessages((m) => [...m, message]);
      }
      fetchConversations();
    });

    return () => {
      if (user && user._id) socket.emit("unregister", user._id);
      socket.off("dm:new_message");
    };
  }, [selected, user, isOpen, socket]);

  useEffect(() => {
    if (!isOpen || !user || !user._id) return;
    fetchConversations();
  }, [isOpen, user]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // debounce search
  useEffect(() => {
    if (!isOpen) return;

    const q = searchQuery.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }

    const id = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/search?q=${encodeURIComponent(q)}&limit=30`,
          { withCredentials: true },
        );
        const users = res.data && res.data.results ? res.data.results : [];
        const existingUserIds = conversations.map((c) => {
          const other = c.userA._id === user?._id ? c.userB._id : c.userA._id;
          return other;
        });
        setSearchResults(
          users.filter(
            (u) =>
              u.username != user?.username && !existingUserIds.includes(u._id),
          ),
        );
      } catch (err) {
        console.error("User search failed:", err);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(id);
  }, [isOpen, conversations, user?._id, user?.username, searchQuery]);

  async function createConversationWithUser(u) {
    if (!u || !u._id) return;
    try {
      const url = `${import.meta.env.VITE_API_URL}/dm/conversations/${u._id}`;
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
    setMessages([]); // Clear messages immediately to avoid showing old chat
    setSelected(convo);
    try {
      const url = `${import.meta.env.VITE_API_URL}/dm/messages/${convo._id}?limit=200`;
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
      const body = { conversationId: selected?._id, content: input };
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/dm/messages`,
        body,
        { withCredentials: true },
      );
      setMessages((m) => [...m, res.data]);
      setInput("");
      fetchConversations();
    } catch (err) {
      console.error("Send failed:", err);
    }
  }

  function otherParticipant(convo) {
    if (!user) return null;
    const a = convo.userA;
    const b = convo.userB;
    const other = a._id === user._id ? b : a;
    return other;
  }

  if (!isOpen) return null;

  return (
    <div className="floating-dm-container">
      <div className="floating-dm-window">
        {/* Header */}
        <div className="floating-dm-header">
          <div className="floating-dm-title">
            <h3>Chats</h3>
          </div>
          <div className="floating-dm-actions">
            <button
              className="floating-dm-action-btn expand-btn"
              onClick={() => {
                if (selected) {
                  window.open(`/messages?chat=${selected._id}`, "_blank");
                } else {
                  window.open("/messages", "_blank");
                }
              }}
              title="Open in new tab"
            >
              <FaExternalLinkAlt />
            </button>
            <button
              className="floating-dm-action-btn close-btn"
              onClick={onClose}
              title="Close"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="floating-dm-content">
          {/* Conversations List - Left Column */}
          <div className="floating-dm-conversations">
            <input
              type="text"
              placeholder="Search username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="floating-dm-search"
            />

            {searchResults.length > 0 && (
              <div className="floating-dm-search-results">
                {searchResults.map((u) => (
                  <div
                    key={u._id}
                    className="floating-dm-user-item"
                    onClick={() => createConversationWithUser(u)}
                  >
                    <img
                      src={resolveAvatar(u.avatarUrl)}
                      alt={u.username}
                      className="floating-dm-avatar"
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "13px" }}>
                        {u.username}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--text-secondary, #999)",
                        }}
                      >
                        {u.karma ? `${u.karma} karma` : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="floating-dm-conv-list">
              {(() => {
                const filtered = conversations.filter((c) => {
                  if (!searchQuery.trim()) return true;
                  const other = otherParticipant(c);
                  return other?.username
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase());
                });
                return filtered.length === 0 ? (
                  <div className="floating-dm-empty">
                    <p>
                      {searchQuery.trim()
                        ? "No matching chats"
                        : "No conversations yet"}
                    </p>
                  </div>
                ) : (
                  filtered.map((c) => {
                    const other = otherParticipant(c);
                    const lastMessage = c.lastMessage;
                    const lastMessagePreview = lastMessage
                      ? lastMessage.content || lastMessage.text
                      : "No messages yet";
                    const lastMessageTime = lastMessage
                      ? formatTime(lastMessage.createdAt)
                      : "";

                    return (
                      <div
                        key={c._id}
                        className={`floating-dm-conversation ${selected?._id === c._id ? "active" : ""
                          }`}
                        onClick={() => openConversation(c)}
                      >
                        <img
                          src={resolveAvatar(other?.avatarUrl)}
                          alt={other?.username}
                          className="floating-dm-avatar"
                        />
                        <div className="floating-dm-conv-info">
                          <h4>{other?.username || "Unknown"}</h4>
                          <p className="floating-dm-last-msg">
                            {lastMessagePreview}
                            {lastMessageTime && (
                              <span
                                style={{
                                  marginLeft: "8px",
                                  fontSize: "11px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {lastMessageTime}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })
                );
              })()}
            </div>
          </div>

          {/* Chat View - Right Column */}
          <div className={`floating-dm-chat-view ${!selected ? "empty" : ""}`}>
            {!selected ? (
              <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
                Select a chat to start messaging
              </div>
            ) : (
              <>
                <div className="floating-dm-chat-header">
                  <Link to={`/user/${otherParticipant(selected)?._id}`}>
                    <img
                      src={resolveAvatar(otherParticipant(selected)?.avatarUrl)}
                      alt="avatar"
                      className="floating-dm-avatar-sm"
                    />
                  </Link>
                  <h3>{otherParticipant(selected)?.username}</h3>
                </div>

                <div className="floating-dm-messages" ref={scrollRef}>
                  {messages.length === 0 ? (
                    <p className="floating-dm-empty">No messages yet</p>
                  ) : (
                    messages.map((m, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          flexDirection:
                            m.senderId?._id === user?._id
                              ? "row-reverse"
                              : "row",
                          alignItems: "flex-end",
                          gap: "6px",
                          marginBottom: "10px",
                        }}
                      >
                        <img
                          src={resolveAvatar(m.senderId?.avatarUrl)}
                          alt="avatar"
                          className="floating-dm-avatar"
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            flexShrink: 0,
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection:
                              m.senderId?._id === user?._id
                                ? "row-reverse"
                                : "row",
                            alignItems: "center",
                            gap: "4px",
                            minWidth: 0,
                          }}
                        >
                          <div
                            className={`floating-dm-message-bubble ${m.senderId?._id === user?._id
                              ? "sent"
                              : "received"
                              }`}
                          >
                            {m.content || m.text}
                          </div>
                          <div
                            style={{
                              fontSize: "10px",
                              color: "var(--text-secondary, #999)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatDetailedTime(m.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="floating-dm-input-area">
                  <input
                    id="floating-dm-message-input"
                    name="message"
                    type="text"
                    placeholder="Message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSend();
                    }}
                    className="floating-dm-input"
                  />
                  <button
                    className="floating-dm-send-btn"
                    onClick={handleSend}
                    disabled={!input.trim()}
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
