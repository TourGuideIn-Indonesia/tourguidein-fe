import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosPrivate from "../api/axiosPrivate";

import { auth, db, firebaseSignIn } from "../api/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function ChatPage() {
  const { orderId } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const bottomRef = useRef(null);
  const unsubscribeRef = useRef(null);

  const [participants, setParticipants] = useState({});
  useEffect(() => {
    initChat();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [orderId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initChat = async () => {
    try {
      setLoading(true);

      const res = await axiosPrivate.post("/api/chat/init", {
        order_id: orderId,
      });

      console.log("INIT CHAT RESPONSE:", res.data);

      const { firebase_custom_token } = res.data;

      await firebaseSignIn(auth, firebase_custom_token);
      console.log("FIREBASE CURRENT USER:", auth.currentUser);
      console.log("FIREBASE UID:", auth.currentUser?.uid);
      // 🔥 ambil participants
      const p = await axiosPrivate.get(
        `/api/chat/participants/${orderId}`
      );
      console.log("PARTICIPANTS API:", p.data);
      const raw = p.data.participants;

      // bikin lookup by user_id
      const normalized = {};

      Object.values(raw).forEach((u) => {
        normalized[String(u.id)] = u;
      });

      console.log("NORMALIZED PARTICIPANTS:", normalized);
      setParticipants(normalized);
      listenMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const listenMessages = () => {
    const messagesRef = collection(
      db,
      "chats",
      `order_${orderId}`,
      "messages"
    );

    const q = query(messagesRef, orderBy("created_at"));

    unsubscribeRef.current = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("MESSAGES FROM FIRESTORE:", list);

      setMessages(list);
      setLoading(false);
    });
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await axiosPrivate.post("/api/chat/send", {
        order_id: orderId,
        text,
      });

      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("order_id", orderId);
      formData.append("image", file);

      await axiosPrivate.post("/api/chat/send-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000); // firestore timestamp (seconds)
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSender = (senderId) => {
    // kalau message dari aku
    if (senderId === auth.currentUser.uid) {
      return {
        name: "You",
        avatar:
          auth.currentUser.photoURL ||
          "https://ui-avatars.com/api/?name=Me",
      };
    }
  
    // kalau dari lawan
    return participants[senderId];
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-white border-b px-4 py-3 font-semibold shadow-sm">
        Chat Order #{orderId}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => {
          console.log("MESSAGE:", msg);
          console.log("SENDER ID:", msg.sender_id);
          console.log("AUTH UID:", auth.currentUser?.uid);
          const isMe = msg.sender_id === auth.currentUser.uid;
          const sender = getSender(msg.sender_id);
          console.log("SENDER DATA:", sender);

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"
                }`}
            >
              {/* AVATAR (left only) */}
              {!isMe && (
                <img
                  src={
                    sender?.avatar ||
                    "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(sender?.name || "User")
                  }
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}

              <div className="max-w-xs">
                {/* NAME */}
                {!isMe && (
                  <p className="text-xs text-gray-500 mb-1">
                    {sender?.name}
                  </p>
                )}

                {/* BUBBLE */}
                <div
                  className={`px-3 py-2 rounded-2xl text-sm break-words
            ${isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow"
                    }`}
                >
                  {msg.type === "image" ? (
                    <img
                      src={msg.image_url}
                      alt="chat"
                      className="rounded-xl max-w-xs"
                    />
                  ) : (
                    msg.text
                  )}
                </div>

                {/* TIME */}
                <p
                  className={`text-[10px] mt-1 ${isMe ? "text-right text-gray-300" : "text-gray-400"
                    }`}
                >
                  {formatTime(msg.created_at?.seconds)}
                </p>
              </div>

              {/* AVATAR (right only) */}
              {isMe && (
                <img
                  src={
                    participants[auth.currentUser.uid]?.avatar ||
                    "https://ui-avatars.com/api/?name=Me"
                  }
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* INPUT AREA */}
      <div className="bg-white border-t p-3 flex items-center gap-2">

        {/* Upload Image */}
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <div className="bg-gray-200 px-3 py-2 rounded-full text-sm">
            📎
          </div>
        </label>

        {/* Text Input */}
        <input
          className="flex-1 border rounded-full px-4 py-2 text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />

        {/* Send Button */}
        <button
          onClick={sendMessage}
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm disabled:opacity-50"
        >
          {uploading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
