import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://live-chat-app-913k.onrender.com"); // ✅ Your backend URL

function App() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [joined, setJoined] = useState(false);

  const joinRoom = () => {
    if (room.trim() !== "") {
      socket.emit("join_room", room);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    const msgData = {
      room,
      message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", msgData);
    setChat((prev) => [...prev, msgData]); // Show your message immediately
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      {!joined ? (
        <div style={{ textAlign: "center" }}>
          <h2>Join a Chat Room</h2>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
          />
          <button onClick={joinRoom} style={{ padding: "10px 20px" }}>
            Join
          </button>
        </div>
      ) : (
        <div>
          <h3>Room: {room}</h3>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              height: "300px",
              overflowY: "auto",
              marginBottom: "20px",
              background: "#f9f9f9",
            }}
          >
            {chat.map((data, index) => (
              <div key={index}>
                <b>{data.time}</b> — {data.message}
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ padding: "10px", width: "70%", marginRight: "10px" }}
          />
          <button onClick={sendMessage} style={{ padding: "10px 20px" }}>
            Send
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
