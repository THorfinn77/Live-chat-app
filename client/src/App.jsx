// client/src/App.jsx
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://10.120.7.109:3001"); // LAN IP of the host system

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", message);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🔥 Live Chat</h2>
      <div style={{ marginBottom: "1rem" }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        <h4>Messages:</h4>
        <ul>
          {chat.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
