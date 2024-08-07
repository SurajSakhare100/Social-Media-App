import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Story = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get('/api/stories');
        setStories(response.data.stories);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    // fetchStories();
  }, []);

  return (
    <div>
      {stories.map((story) => (
        <div key={story._id}>
          <img src={story.mediaUrl} alt="Story" />
          <p>Expires at: {new Date(story.expirationTime).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default Story;
