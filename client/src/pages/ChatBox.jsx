import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getChat, getUserById, sendChat } from '../index.js';
import Chat from '../components/Chat.jsx';

import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,  // Support cross-origin credentials
});

const ChatBox = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const { receiverId } = useParams();
  const userId = useSelector((state) => state.user?._id);

  // Fetch receiver data when receiverId changes
  useEffect(() => {
    const fetchReceiverData = async () => {
      if (!receiverId) return;
      try {
        const user = await getUserById(receiverId);
        setReceiver(user);
      } catch (error) {
        console.error('Failed to fetch receiver data:', error);
      }
    };
    fetchReceiverData();
  }, [receiverId]);

  // Fetch chat messages when userId or receiverId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId || !receiverId) return;
      try {
        const chatMessages = await getChat(userId, receiverId);
        setMessages(chatMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };
    fetchMessages();
  }, [userId, receiverId]);

  // Handle socket connection, message receiving, and cleanup
  useEffect(() => {
    if (!userId) return;

    socket.emit('register', userId);
    const handleMessageReceive = (message) => {
      if (
        (message.sender === userId && message.receiver === receiverId) ||
        (message.sender === receiverId && message.receiver === userId)
      ) {
        setMessages((prevMessages) =>
          [...prevMessages, message].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        );
      }
    };

    socket.on('receiveMessage', handleMessageReceive);

    return () => {
      socket.off('receiveMessage', handleMessageReceive);
    };
  }, [userId, receiverId]);

  // Send message to socket and update chat state
  const sendMessage = useCallback(() => {
    if (!message.trim()) return;
    const newMessage = { sender: userId, receiver: receiverId, content: message, timestamp: new Date() };
    
    socket.emit('sendMessage', newMessage);
    setMessages((prevMessages) =>
      [...prevMessages, newMessage].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    );
    setMessage('');
    sendChat(newMessage); // Optionally save message to the database
  }, [message, userId, receiverId]);

  return (
    <div className="flex flex-col h-full w-full bg-[#F4F2EE] pt-16 md:pt-20">
      <div className="flex items-center bg-green-600 text-white py-4 px-6 shadow-md">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            {receiver?.profilePicture && (
              <img
                src={receiver.profilePicture}
                alt={`${receiver.profileName}'s profile`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
        <div className="ml-4 flex flex-col">
          <h1 className="text-lg font-semibold">{receiver?.profileName}</h1>
          <h3 className="text-sm">{receiver?.username}</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-[#F4F2EE]">
        {messages.map((msg, index) => (
          <Chat key={index} msg={msg} userId={userId} />
        ))}
      </div>

      <div className="flex items-center bg-white p-4 border-t border-gray-300">
        <input
          type="text"
          value={message}
          className="flex-1 border border-gray-300 rounded-lg py-2 px-4 mr-2"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()} // Send on Enter key press
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
