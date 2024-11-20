import React, { useEffect, useState } from "react";
import { List, Avatar, Spin, Typography } from "antd";
import { io } from "socket.io-client";

const { Title, Text } = Typography;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = io("http://localhost:5000"); // Connect to WebSocket server

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("/api/user/all-users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    // Notify server the user is online
    const userId = localStorage.getItem("userId"); // Save user ID in localStorage
    socket.emit("user-online", userId);

    // Cleanup on component unmount
    // return () => {
    //   socket.disconnect();
    // };
  }, [socket]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mt-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white min-h-screen p-6 flex flex-col items-center">
      <Title
        level={2}
        className="mt-10 text-yellow-300 font-bold mb-8 text-center"
      >
        Users
      </Title>
      <List
        itemLayout="horizontal"
        dataSource={users}
        renderItem={(user) => (
          <List.Item className="px-10 flex items-center justify-between bg-gray-800 p-4 rounded-xl shadow-lg mb-4 hover:bg-gray-700 transition-all">
            {/* Profile Avatar */}
            <Avatar
              src={
                user.profile_photo ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              }
              className="ml-3 w-14 h-14 rounded-full border border-gray-400"
            />
            {/* User Details */}
            <div className="flex flex-col flex-1 ml-4">
              <Text className="text-lg font-bold text-yellow-300">
                {user.username}
              </Text>
              <Text
                className={
                  user.status === "online" ? "text-green-400" : "text-red-400"
                }
              >
                {user.status === "online" ? "Online" : "Offline"}
              </Text>
            </div>
          </List.Item>
        )}
        className="w-full max-w-4xl"
      />
    </div>
  );
}
