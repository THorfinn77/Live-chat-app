const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for cross-network access
    methods: ["GET", "POST"],
  },
});

// Store active users and rooms
const activeUsers = new Map();
const rooms = new Map();

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user connected`);

  // User joins with profile
  socket.on("join_user", (userData) => {
    activeUsers.set(socket.id, {
      id: socket.id,
      username: userData.username || `User_${socket.id.slice(-4)}`,
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${userData.username || 'User'}&background=6366f1&color=fff`,
      status: "online",
      currentRoom: null
    });
    
    // Notify all users about new user
    io.emit("user_status", {
      userId: socket.id,
      status: "online",
      username: activeUsers.get(socket.id).username
    });
    
    console.log(`👤: User ${activeUsers.get(socket.id).username} joined`);
  });

  // Join room with enhanced features
  socket.on("join_room", (data) => {
    const { room, username } = data;
    const user = activeUsers.get(socket.id);
    
    if (user) {
      // Leave previous room if any
      if (user.currentRoom) {
        socket.leave(user.currentRoom);
        socket.to(user.currentRoom).emit("user_left_room", {
          userId: socket.id,
          username: user.username
        });
      }
      
      socket.join(room);
      user.currentRoom = room;
      
      // Initialize room if doesn't exist
      if (!rooms.has(room)) {
        rooms.set(room, {
          name: room,
          users: new Set(),
          messages: []
        });
      }
      
      rooms.get(room).users.add(socket.id);
      
      // Notify room about new user
      socket.to(room).emit("user_joined_room", {
        userId: socket.id,
        username: user.username,
        avatar: user.avatar
      });
      
      // Send room info to joining user
      socket.emit("room_joined", {
        room: room,
        users: Array.from(rooms.get(room).users).map(id => activeUsers.get(id)).filter(Boolean)
      });
      
      console.log(`👥: ${user.username} joined room: ${room}`);
    }
  });

  // Send message with enhanced features
  socket.on("send_message", (data) => {
    const user = activeUsers.get(socket.id);
    if (!user || !user.currentRoom) return;

    const messageData = {
      id: `${socket.id}_${Date.now()}`,
      room: user.currentRoom,
      message: data.message,
      username: user.username,
      avatar: user.avatar,
      time: new Date().toISOString(),
      status: "sent"
    };

    // Store message in room
    const room = rooms.get(user.currentRoom);
    if (room) {
      room.messages.push(messageData);
      // Keep only last 100 messages
      if (room.messages.length > 100) {
        room.messages = room.messages.slice(-100);
      }
    }

    // Send to all users in room
    io.to(user.currentRoom).emit("receive_message", messageData);
    
    console.log(`📨: ${user.username} sent message to ${user.currentRoom}: ${data.message}`);
  });

  // Typing indicator
  socket.on("typing", (data) => {
    const user = activeUsers.get(socket.id);
    if (user && user.currentRoom) {
      socket.to(user.currentRoom).emit("user_typing", {
        userId: socket.id,
        username: user.username,
        isTyping: data.isTyping
      });
    }
  });

  // Message reactions
  socket.on("react_to_message", (data) => {
    const user = activeUsers.get(socket.id);
    if (user && user.currentRoom) {
      io.to(user.currentRoom).emit("message_reaction", {
        messageId: data.messageId,
        reaction: data.reaction,
        userId: socket.id,
        username: user.username
      });
    }
  });

  // Message read status
  socket.on("mark_as_read", (data) => {
    const user = activeUsers.get(socket.id);
    if (user && user.currentRoom) {
      io.to(user.currentRoom).emit("message_read", {
        messageId: data.messageId,
        userId: socket.id,
        username: user.username
      });
    }
  });

  // Disconnect handling
  socket.on("disconnect", () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      console.log(`❌: User ${user.username} disconnected`);
      
      // Notify room if user was in one
      if (user.currentRoom) {
        socket.to(user.currentRoom).emit("user_left_room", {
          userId: socket.id,
          username: user.username
        });
        
        // Remove from room
        const room = rooms.get(user.currentRoom);
        if (room) {
          room.users.delete(socket.id);
        }
      }
      
      // Notify all users about offline status
      io.emit("user_status", {
        userId: socket.id,
        status: "offline",
        username: user.username
      });
      
      activeUsers.delete(socket.id);
    }
  });
});

// API endpoints for room management
app.get("/api/rooms", (req, res) => {
  const roomList = Array.from(rooms.values()).map(room => ({
    name: room.name,
    userCount: room.users.size,
    lastMessage: room.messages[room.messages.length - 1]
  }));
  res.json(roomList);
});

app.get("/api/room/:roomId/messages", (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (room) {
    res.json(room.messages);
  } else {
    res.json([]);
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log("✅ Advanced Messenger Server is running on port", PORT);
  console.log("🌐 Server accessible from any network (0.0.0.0:" + PORT + ")");
  console.log("📱 Access from other devices using your network IP");
  console.log("🚀 Production mode: Cross-WiFi chat enabled");
});
