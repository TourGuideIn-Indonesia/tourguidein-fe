import React, { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";
import { useNavigate } from "react-router-dom";

function Messages() {
  const token = localStorage.getItem("token");
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const fetchChats = async () => {
      try {
        const res = await axiosPrivate.get("/api/chat");
        setChats(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChats();
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Messages</h1>
          <p className="text-gray-600">
            Your conversations will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {chats.length === 0 && (
        <p className="text-gray-500">No conversations yet.</p>
      )}

      <div className="space-y-4">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => navigate(`/chat/${chat.order_id}`)}
            className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-100"
          >
            <p className="font-semibold">Order #{chat.order_id}</p>
            <p className="text-sm text-gray-600">
              {chat.last_message || "No messages yet"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
