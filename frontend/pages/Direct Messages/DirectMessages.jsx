/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";
import { useSocket } from "../../context/SocketContext";
import "./DirectMessages.css";
import profileFallback from "../../assets/profile.png";
import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";

export default function DirectMessages() {
  const socket = useSocket();
  const [searchParams] = useSearchParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/me`,
          { withCredentials: true },
        );
        setCurrentUser(res.data);
      } catch (err) {
        console.log("Error fetching user:", err);
        setCurrentUser(null);
      }
    };

    fetchMe();
  }, []);

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
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
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
    if (!socket || !currentUser || !currentUser._id) return;

    socket.emit("register", currentUser._id);

    socket.on("dm:new_message", (payload) => {
      const { conversationId, message } = payload;
      if (selected && conversationId === selected._id) {
        setMessages((m) => [...m, message]);
      }

      // refresh conversations list so UI shows latest
      fetchConversations();
    });

    return () => {
      if (currentUser && currentUser._id)
        socket.emit("unregister", currentUser._id);
      socket.off("dm:new_message");
    };
  }, [selected, currentUser, socket]);

  // fetch conversations once currentUser is available (prevents 401 when landing on /messages)
  useEffect(() => {
    if (currentUser && currentUser._id) {
      fetchConversations();
    }
  }, [currentUser]);

  async function openConversation(convo) {
    setMessages([]);
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

  // Open specific chat from URL parameter
  useEffect(() => {
    const chatId = searchParams.get("chat");
    if (chatId && conversations.length > 0 && currentUser) {
      const convo = conversations.find((c) => c._id === chatId);
      if (convo) {
        openConversation(convo);
      }
    }
  }, [searchParams, conversations, currentUser]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // debounce search
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }

    const id = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/search?q=${encodeURIComponent(q)}&limit=30`,
          {
            withCredentials: true,
          },
        );
        const users = res.data && res.data.results ? res.data.results : [];
        setSearchResults(
          users.filter((user) => user.username != currentUser.username),
        );
      } catch (err) {
        console.error("User search failed:", err);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(id);
  }, [searchQuery, currentUser?.username]);

  async function createConversationWithUser(user) {
    if (!user || !user._id) return;
    try {
      const url = `${import.meta.env.VITE_API_URL}/dm/conversations/${user._id}`;
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
    if (!currentUser) return null;
    const a = convo.userA;
    const b = convo.userB;
    const other = a._id === currentUser._id ? b : a;
    return other;
  }

  return (
    <div style={{ display: "flex" }}>
      <LeftSidebar />
      <div className={"chat-layout"}>
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
                  if (searchResults.length)
                    createConversationWithUser(searchResults[0]);
                }}
              >
                +
              </button>
              {searchResults.length > 0 && (
                <div className="chat-search-dropdown">
                  {searchResults.map((u) => (
                    <div
                      key={u._id}
                      className="chat-search-item"
                      onClick={() => createConversationWithUser(u)}
                    >
                      <img
                        src={resolveAvatar(u.avatarUrl)}
                        className="chat-avatar"
                        alt="av"
                      />
                      <div style={{ marginLeft: 8 }}>
                        <div style={{ fontWeight: 700 }}>{u.username}</div>
                        <div
                          style={{ fontSize: 12, color: "var(--dm-subtext)" }}
                        >
                          {u.karma ? `${u.karma} karma` : ""}
                        </div>
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
                  className={`chat-list-item ${selected?._id === c._id ? "active" : ""}`}
                  onClick={() => openConversation(c)}
                >
                  <img
                    src={resolveAvatar(other?.avatarUrl)}
                    className="chat-avatar"
                    alt="av"
                  />
                  <div className="chat-list-text">
                    <div className="chat-list-name">
                      {other?.username || "Unknown"}
                    </div>
                    <div className="chat-list-last">
                      <span
                        style={{
                          color: "var(--dm-subtext)",
                          fontSize: "13px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                      >
                        {lastMessagePreview}
                      </span>
                      {lastMessageTime && (
                        <span
                          style={{
                            color: "var(--dm-subtext)",
                            fontSize: "12px",
                            marginLeft: "8px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {lastMessageTime}
                        </span>
                      )}
                    </div>
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
              <div
                className="chat-window-header"
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Link to={`/user${otherParticipant(selected)?._id}`}>
                  <img
                    src={resolveAvatar(otherParticipant(selected)?.avatarUrl)}
                    className="chat-avatar"
                    alt="av"
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}
                  />
                </Link>
                {otherParticipant(selected)?.username}
              </div>

              <div className="chat-messages" ref={scrollRef}>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection:
                        m.senderId?._id === currentUser?._id
                          ? "row-reverse"
                          : "row",
                      alignItems: "flex-end",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <img
                      src={resolveAvatar(m.senderId?.avatarUrl)}
                      className="chat-avatar"
                      alt="av"
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        flexShrink: 0,
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection:
                          m.senderId?._id === currentUser?._id
                            ? "row-reverse"
                            : "row",
                        alignItems: "center",
                        gap: "6px",
                        minWidth: 0,
                        marginTop: "4px",
                      }}
                    >
                      <div
                        className={`chat-message ${m.senderId?._id === currentUser?._id ? "sent" : "received"}`}
                      >
                        {m.content || m.text}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--dm-subtext)",
                          whiteSpace: "nowrap",
                          marginBottom: "2px",
                        }}
                      >
                        {formatDetailedTime(m.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chat-input-bar">
                <input
                  id="chat-message-input"
                  name="message"
                  className="chat-input"
                  placeholder="Message"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                />
                <button
                  className="chat-send-btn"
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
  );
}
