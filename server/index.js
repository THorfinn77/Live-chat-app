const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for now (safe for dev)
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", (msg) => {
    console.log("Message received:", msg);
    io.emit("receive_message", msg); // Broadcast to everyone including sender
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
