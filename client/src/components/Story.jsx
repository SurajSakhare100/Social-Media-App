import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { createStory } from '../index.js'; // Make sure this path is correct

// Connect to your server with the correct URL
// const socket = io('http://localhost:3000'); // Ensure this URL matches your backend URL

const Story = () => {
  const [stories, setStories] = useState([]);
  const [error, setError] = useState('');

  const user = useSelector((state) => state.user);

  // Handle file upload for story creation
  const handleStoryUpload = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      try {
        const formData = new FormData();
        formData.append('story', file); // Add the file to FormData for upload
        
        // Call the backend API to create a story
        const response = await createStory(user._id, formData);

        // Optionally update the stories state with the new story
        setStories((prevStories) => [...prevStories, response.data.story]);

      } catch (error) {
        console.error('Error uploading story:', error);
        setError('Failed to upload story. Please try again.');
      }
    } else {
      console.log('No file selected');
    }
  };

  // Use effect to listen for existing stories and new stories from the socket server
  // useEffect(() => {
  //   // Listen for existing stories from the server
  //   socket.on('existingStories', (stories) => {
  //     setStories(stories); // Update the state with the existing stories
  //   });

  //   // Listen for new stories being added in real-time
  //   socket.on('newStory', (story) => {
  //     setStories((prevStories) => [...prevStories, story]); // Add new story to state
  //   });

  //   // Cleanup on component unmount
  //   return () => {
  //     socket.off('existingStories');
  //     socket.off('newStory');
  //   };
  // }, []);

  return (
    <div className='flex gap-4 items-center'>
      <div className='flex flex-col'>
        <label 
          htmlFor="createStory" 
          className='w-20 h-20 bg-white rounded-full px-2 py-4 flex items-center justify-center cursor-pointer'
        >
          +
        </label>
        <input 
          id="createStory" 
          name="createStory" 
          type="file" 
          alt="story" 
          className='hidden' 
          onChange={handleStoryUpload} // Call the upload function when file is selected
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Display stories */}
      {stories.length === 0 ? (
        <p>No stories available.</p>
      ) : (
        stories.map((story) => (
          <div key={story._id} className='flex flex-col items-center'>
            <img 
              src={story.mediaUrl} 
              alt="Story" 
              className='w-20 h-20 rounded-full object-cover' 
            />
            <p>Expires at: {new Date(story.expirationTime).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Story;
