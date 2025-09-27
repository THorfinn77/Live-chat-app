import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import config from "./config";
import "./App.css";

// Auto-detect server URL for cross-device and cross-WiFi support
const getServerUrl = () => {
  const hostname = window.location.hostname;
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return config.serverUrl;
  }
  
  // Local network (same WiFi)
  if (hostname.includes('192.168.') || hostname.includes('10.0.') || hostname.includes('172.')) {
    return `http://${hostname}:5000`;
  }
  
  // Production (cross-WiFi)
  return config.serverUrl;
};

const socket = io(getServerUrl());

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [joined, setJoined] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [roomUsers, setRoomUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [serverUrl, setServerUrl] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  useEffect(() => {
    // Set server URL for display
    setServerUrl(getServerUrl());

    // Connection status monitoring
    socket.on("connect", () => {
      setConnectionStatus("connected");
      console.log("✅ Connected to server:", getServerUrl());
    });

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected");
      console.log("❌ Disconnected from server");
    });

    socket.on("connect_error", (error) => {
      setConnectionStatus("error");
      console.error("❌ Connection error:", error);
    });

    // Only join user when username is available
    if (username.trim()) {
      socket.emit("join_user", { username });
    }

    socket.on("user_status", (data) => {
      setOnlineUsers(prev => {
        const filtered = prev.filter(user => user.userId !== data.userId);
        if (data.status === "online") {
          return [...filtered, data];
        }
        return filtered;
      });
    });

    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    socket.on("room_joined", (data) => {
      setRoomUsers(data.users);
    });

    socket.on("user_joined_room", (data) => {
      setRoomUsers(prev => [...prev, data]);
    });

    socket.on("user_left_room", (data) => {
      setRoomUsers(prev => prev.filter(user => user.userId !== data.userId));
    });

    socket.on("user_typing", (data) => {
      setTypingUsers(prev => {
        const filtered = prev.filter(user => user.userId !== data.userId);
        if (data.isTyping) {
          return [...filtered, data];
        }
        return filtered;
      });
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("receive_message");
      socket.off("room_joined");
      socket.off("user_joined_room");
      socket.off("user_left_room");
      socket.off("user_typing");
      socket.off("user_status");
    };
  }, []);

  const joinRoom = () => {
    if (room.trim() !== "" && username.trim() !== "") {
      // First join as user, then join room
      socket.emit("join_user", { username });
      socket.emit("join_room", { room, username });
      setUserProfile({
        username,
        avatar: `https://ui-avatars.com/api/?name=${username}&background=6366f1&color=fff`,
        status: "online"
      });
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    const msgData = {
      message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", msgData);
    setMessage("");
    setIsTyping(false);
    socket.emit("typing", { isTyping: false });
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { isTyping: true });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("typing", { isTyping: false });
    }, 1000);
  };

  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const emojis = ["😀", "😂", "😍", "🤔", "👍", "👎", "❤️", "🎉", "🔥", "💯"];

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!joined) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="app-title">🚀 QuantumChat</h1>
            <p className="app-subtitle">Connect across dimensions</p>
          </div>
          
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="modern-input"
              maxLength={20}
            />
          </div>
          
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="modern-input"
              maxLength={20}
            />
          </div>
          
          <button 
            onClick={joinRoom} 
            className="join-btn"
            disabled={!username.trim() || !room.trim()}
          >
            Enter Quantum Space
          </button>
          
          <div className="features-preview">
            <div className="feature">✨ Real-time messaging</div>
            <div className="feature">🌐 Cross-network chat</div>
            <div className="feature">📱 Mobile optimized</div>
            <div className="feature">⚡ Ultra-fast sync</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-info">
          <div className="room-info">
            <h2>#{room}</h2>
            <span className="user-count">{roomUsers.length} users</span>
          </div>
        </div>
        <div className="header-actions">
          <div className={`connection-indicator ${connectionStatus}`}>
            <div className={`status-dot ${connectionStatus}`}></div>
            <span>
              {connectionStatus === "connected" && "Connected"}
              {connectionStatus === "connecting" && "Connecting..."}
              {connectionStatus === "disconnected" && "Disconnected"}
              {connectionStatus === "error" && "Connection Error"}
            </span>
          </div>
          <div className="server-info">
            <small>Server: {serverUrl}</small>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-messages">
        {chat.map((data, index) => (
          <div key={index} className={`message ${data.username === username ? 'own-message' : 'other-message'}`}>
            <div className="message-content">
              <div className="message-header">
                <img 
                  src={data.avatar || `https://ui-avatars.com/api/?name=${data.username}&background=6366f1&color=fff`} 
                  alt={data.username}
                  className="message-avatar"
                />
                <span className="message-username">{data.username}</span>
                <span className="message-time">{formatTime(data.time)}</span>
              </div>
              <div className="message-text">{data.message}</div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="typing-text">
              {typingUsers.map(user => user.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="message-input-container">
        <div className="message-input-wrapper">
          <button 
            className="emoji-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😀
          </button>
          
          {showEmojiPicker && (
            <div className="emoji-picker">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  className="emoji-option"
                  onClick={() => addEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={handleTyping}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="message-input"
            maxLength={500}
          />
          
          <button 
            onClick={sendMessage}
            className="send-btn"
            disabled={!message.trim()}
          >
            <span className="send-icon">🚀</span>
          </button>
        </div>
      </div>

      {/* Online Users Sidebar */}
      <div className="online-users">
        <h3>Online Users</h3>
        <div className="users-list">
          {roomUsers.map((user, index) => (
            <div key={index} className="user-item">
              <div className="user-avatar">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff`} 
                  alt={user.username}
                />
                <div className="online-status"></div>
              </div>
              <span className="user-name">{user.username}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;