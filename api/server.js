import express from "express";
import dotenv from "dotenv";
import UserRoute from "./routes/user.js";
import CookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import { updateUserStatus } from "./models/user.js"; // Function to update user status

dotenv.config();

const app = express();
app.use(express.json());
app.use(CookieParser());
app.use("/api/user", UserRoute);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend URL in production
  },
});

// Track connected users
const connectedUsers = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user online
  socket.on("user-online", async (userId) => {
    connectedUsers[userId] = socket.id; // Map user ID to socket ID
    await updateUserStatus(userId, "online"); // Update status in DB
    console.log("User online:", userId);
    io.emit("status-update", { userId, status: "online" }); // Notify others
  });

  // Handle user disconnect
  socket.on("disconnect", async () => {
    const userId = Object.keys(connectedUsers).find(
      (key) => connectedUsers[key] === socket.id
    );
    if (userId) {
      delete connectedUsers[userId];
      await updateUserStatus(userId, "offline"); // Update status in DB
      console.log("User offline:", userId);
      io.emit("status-update", { userId, status: "offline" }); // Notify others
    }
  });
});

// Start the server
server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
