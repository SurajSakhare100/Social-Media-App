// AddStory.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AddStory = () => {
    const [stories, setStories] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch stories from your API
        const fetchStories = async () => {
            try {
                const response = await fetch('/api/stories'); // Replace with your API endpoint
                const data = await response.json();
                setStories(data);
            } catch (err) {
                setError('Failed to load stories');
            }
        };
        fetchStories();
    }, []);

    const handleStoryUpload = (e) => {
        // Handle story upload logic here
    };

    // Group stories by user
    const groupedStories = stories.reduce((acc, story) => {
        const userId = story.userId._id;
        if (!acc[userId]) {
            acc[userId] = [];
        }
        acc[userId].push(story);
        return acc;
    }, {});

    return (
        <div className='flex gap-4 items-center overflow-y-auto'>
            <div className='flex flex-col'>
                <label htmlFor="createStory" className='w-20 h-20 bg-white rounded-full px-2 py-4 flex items-center justify-center cursor-pointer'>
                    +
                </label>
                <input id="createStory" name="createStory" type="file" className='hidden' onChange={handleStoryUpload} />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {/* Display grouped stories */}
            {Object.keys(groupedStories).length === 0 ? (
                <p>No stories available.</p>
            ) : (
                Object.keys(groupedStories).map(userId => (
                    <Link key={userId} to={`/story/${userId}`} className='flex flex-col items-center'>
                        <div className="relative w-24 h-24 rounded-full border-4 border-red-500 flex items-center justify-center">
                            <img src={groupedStories[userId][0].userId.profilePicture} alt="Story" className='w-20 h-20 rounded-full object-cover hover:scale-110 ease-in-out' />
                        </div>
                        <p>{groupedStories[userId][0].userId.username}</p>
                    </Link>
                ))
            )}
        </div>
    );
};

export default AddStory;
