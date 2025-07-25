const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://live-chat-app-5d8g.vercel.app"], // ✅ Your deployed frontend link
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user connected`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`👥: User with ID: ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", (data) => {
    console.log(`📨: Message sent to room ${data.room}: ${data.message}`);
    socket.to(data.room).emit("receive_message", data); // ✅ emit to others in the room
  });

  socket.on("disconnect", () => {
    console.log("❌: User Disconnected", socket.id);
  });
});

server.listen(5000, () => {
  console.log("✅ Server is running on port 5000");
});
