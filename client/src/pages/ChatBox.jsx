import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { getChat, getCurrentUser, getUserById, sendChat } from '../index.js';
import Chat from '../components/Chat.jsx';

const socket = io('http://localhost:5000');

const ChatBox = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const { receiverId } = useParams();
  const [userId, setUserId] = useState(null);
 
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser();
                setUserId(userData._id);
            } catch (error) {
                console.error('Error fetching user or posts:', error);
            }
        };

        fetchUser();
    }, []);

  useEffect(() => {
    const fetchReceiverData = async () => {
      try {
        const user = await getUserById(receiverId);
        setReceiver(user);
      } catch (error) {
        console.error('Failed to fetch receiver data:', error);
      }
    };

    fetchReceiverData();
  }, [receiverId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const chatMessages = await getChat(userId, receiverId);
        // Ensure messages are sorted by timestamp
        chatMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(chatMessages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    if (userId && receiverId) {
      fetchMessages();
    }
  }, [userId, receiverId]);

  useEffect(() => {
    socket.emit('register', userId);

    socket.on('receiveMessage', (message) => {
      if (
        (message.sender === userId && message.receiver === receiverId) ||
        (message.sender === receiverId && message.receiver === userId)
      ) {
        // Add new message to the end of the messages array
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          // Sort messages to ensure correct order
          updatedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          return updatedMessages;
        });
      }
    });

    socket.on('messageSent', (message) => {
      console.log('Message sent confirmation:', message);
      if (message) {
        sendChat(message);
      }
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('messageSent');
    };
  }, [userId, receiverId]);

  const sendMessage = () => {
    if (message.trim() === '') return;
    const newMessage = { sender: userId, receiver: receiverId, content: message, timestamp: new Date() };
    socket.emit('sendMessage', newMessage);
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      // Sort messages to ensure correct order
      updatedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      return updatedMessages;
    });
    setMessage('');
  };

  return (
    <div className="flex flex-col h-[88vh]">
      <div className="flex items-center bg-green-600 text-white py-4 px-6 shadow-md">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={receiver?.profilePicture}
              alt={`${receiver?.profileName}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="ml-4 flex flex-col">
          <h1 className="text-lg font-semibold">{receiver?.profileName}</h1>
          <h3 className="text-sm">{receiver?.email}</h3>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg, index) => (
          <Chat key={index} msg={msg} userId={userId} />
        ))}
      </div>
      <div className="flex items-center  bg-white p-4 border-t border-gray-300">
        <input
          type="text"
          value={message}
          className="flex-1 border border-gray-300 rounded-lg py-2 px-4 mr-2"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
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
