import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;

    socket.emit("send_message", message);
    setMessage("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Live Chat</h2>
      <div style={{ marginBottom: 20 }}>
        {chat.map((msg, i) => (
          <div key={i} style={{ margin: "5px 0" }}>
            {msg}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type message..."
        style={{ width: "70%", marginRight: 10 }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
