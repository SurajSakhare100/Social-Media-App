const users = {}; // Object to store user socket mappings

export const initializeSockets = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Register user on 'register' event
    socket.on('register', (userId) => {
      users[userId] = socket.id; // Store socket ID for the user
      console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
    });

    // Handle receiving a new message
    socket.on('sendMessage', async (message) => {
      const { sender, receiver, content } = message;
      const newMessage = { sender, receiver, content };

      try {
        // Save the message to the database (assumed functionality)
        // await Message.create(newMessage);
        await sendMessage(newMessage); // Assuming `sendMessage` is a function that handles saving

        const receiverSocketId = users[receiver];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receiveMessage', newMessage);
        }

        socket.emit('messageSent', newMessage);
      } catch (err) {
        console.error('Error sending message:', err);
        socket.emit('error', 'Message could not be sent');
      }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      // Remove user from the users object
      for (const [userId, socketId] of Object.entries(users)) {
        if (socketId === socket.id) {
          delete users[userId];
          console.log(`User unregistered: ${userId}`);
          break;
        }
      }
    });

    // Additional custom socket events can be added here
  });
};

// Optional helper function for message saving (if needed)
async function sendMessage(message) {
  // Implement logic for saving the message to the database
  console.log('Message saved:', message);
  // e.g., await Message.create(message);
}
