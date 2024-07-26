import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { getChat, getUserById } from "../index.js";

const socket = io("http://localhost:5000");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const { receiverId } = useParams();
  const userId = useSelector((state) => state.user.userDetails?._id);

  useEffect(() => {
    const fetchReceiverData = async () => {
      try {
        const user = await getUserById(receiverId);
        setReceiver(user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchReceiverData();
  }, [receiverId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prevMessages = await getChat(userId,receiverId);
        setMessages((newMessage) => [...prevMessages, newMessage]);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    socket.emit("register", userId);
    socket.on("receiveMessage", (message) => {
      if (
        (message.sender === userId && message.receiver === receiverId) ||
        (message.sender === receiverId && message.receiver === userId)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    socket.on("messageSent", (message) => {
      console.log("Message sent confirmation:", message);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("messageSent");
    };
  }, [userId, receiverId]);

  const sendMessage = () => {
    const newMessage = { sender: userId, receiver: receiverId, content: message };
    socket.emit("sendMessage", newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center bg-green-600 text-white py-4 px-6">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={receiver?.profilePicture}
              alt={`${receiver?.profileName}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="ml-4">
          <h1 className="text-lg font-semibold">{receiver?.profileName}</h1>
          <h3 className="text-sm">{receiver?.email}</h3>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex my-2 ${msg.sender === userId ? "justify-end" : "justify-start"}`}
          >
            <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.sender === userId ? "bg-blue-500 text-white" : "bg-white text-black"}`}>
              <strong>{msg.content}</strong>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center bg-white p-4 border-t border-gray-300">
        <input
          type="text"
          value={message}
          className="flex-1 border border-gray-300 rounded-lg py-2 px-4"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button
          className="btn btn-info ml-4"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
