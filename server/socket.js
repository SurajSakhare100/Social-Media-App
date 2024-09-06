// import { createStory } from "./controllers/story.controller.js";
// import Story from "./models/story.model.js";

// export default function storySockets(io) {
//   io.on('connection', async (socket) => {

//     console.log('New user connected');

//     // Fetch existing stories from MongoDB and send them to the connected client
//     await Story.find()
//       .then(stories => {
//         socket.emit('existingStories', stories);
//       })
//       .catch(err => {
//         console.error('Error fetching stories:', err);
//       });

//     // Listen for a new story creation
//     socket.on('addStory', (storyContent) => {
//       // const newStory = new Story({ content: storyContent });
//       createStory()

//       // Save the new story to MongoDB
//       newStory.save()
//         .then(savedStory => {
//           // Emit the new story to all connected clients
//           io.emit('newStory', savedStory);
//         })
//         .catch(err => {
//           console.error('Error saving story:', err);
//         });
//     });

//     socket.on('disconnect', () => {
//       console.log('User disconnected');
//     });
//   });
// };


import { createStory } from "./controllers/story.controller.js";
import Story from "./models/story.model.js";

export default function storySockets(io) {
  io.on('connection', async (socket) => {
    console.log(socket)
    console.log('New user connected');

    try {
      // Fetch existing stories from MongoDB and send them to the connected client
      const stories = await Story.find();
      socket.emit('existingStories', stories);
    } catch (err) {
      console.error('Error fetching stories:', err);
      socket.emit('error', 'Failed to fetch existing stories');
    }

    // Listen for a new story creation
    socket.on('addStory', async (storyContent) => {
      try {
        // Create a new story instance
        const newStory = new Story({ content: storyContent });

        // Save the new story to MongoDB
        const savedStory = await newStory.save();
        
        // Emit the new story to all connected clients
        io.emit('newStory', savedStory);
      } catch (err) {
        console.error('Error saving story:', err);
        socket.emit('error', 'Failed to save new story');
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
