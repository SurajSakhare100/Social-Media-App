import React from 'react';

function Chat({ msg, userId }) {
  const isSender = msg.sender._id === userId;
  return (
    <div
      className={`flex ${isSender ? 'justify-end' : 'justify-start'} my-2`}
    >
      <div
        className={`px-4 py-2 rounded-lg max-w-xs ${isSender ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
      >
        <p>{msg.content}</p>
      </div>
    </div>
  );
}

export default Chat;
