import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],  // CORS Fix
  },
});

// Store online users and their groups
const userSocketMap = {}; // { userId: socketId }
const groupSocketMap = {}; // { groupId: [socketIds] }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId] || null;  // Prevent undefined errors
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for joining a group
  socket.on("joinGroup", (groupId) => {
    if (!groupSocketMap[groupId]) groupSocketMap[groupId] = [];
    groupSocketMap[groupId].push(socket.id);
    socket.join(groupId);
    console.log(`User ${userId} joined group ${groupId}`);
  });

  // Listen for new messages in a group
  socket.on("sendGroupMessage", (groupId, messageData) => {
    io.to(groupId).emit("newGroupMessage", messageData);  // Broadcast message to group
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
